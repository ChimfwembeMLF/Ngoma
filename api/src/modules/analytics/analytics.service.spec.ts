import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { Earnings } from '../payments/entities/earnings.entity';
import { Track } from '../tracks/entities/track.entity';
import { Tip } from '../payments/entities/tip.entity';

type QueryBuilderMock = {
  leftJoin: jest.Mock;
  select: jest.Mock;
  addSelect: jest.Mock;
  where: jest.Mock;
  andWhere: jest.Mock;
  groupBy: jest.Mock;
  addGroupBy: jest.Mock;
  orderBy: jest.Mock;
  addOrderBy: jest.Mock;
  limit: jest.Mock;
  getRawMany: jest.Mock;
  getRawOne: jest.Mock;
  orderByCalls: Array<{ column: string; direction: string }>;
};

function createQueryBuilderMock(getRawManyResult: unknown[] = []): QueryBuilderMock {
  const orderByCalls: Array<{ column: string; direction: string }> = [];
  const qb: QueryBuilderMock = {
    leftJoin: jest.fn(),
    select: jest.fn(),
    addSelect: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    groupBy: jest.fn(),
    addGroupBy: jest.fn(),
    orderBy: jest.fn((column: string, direction: string) => {
      orderByCalls.push({ column, direction });
      return qb;
    }),
    addOrderBy: jest.fn(),
    limit: jest.fn(),
    getRawMany: jest.fn().mockResolvedValue(getRawManyResult),
    getRawOne: jest.fn().mockResolvedValue({
      totalNetEarnings: '0',
      totalPlatformFees: '0',
      uniqueSupporters: '0',
      totalPlays: '0',
      totalDownloads: '0',
      publishedTrackCount: '0',
      total: '0',
      count: '0',
      totalAmount: '0',
    }),
    orderByCalls,
  };

  for (const method of [
    'leftJoin',
    'select',
    'addSelect',
    'where',
    'andWhere',
    'groupBy',
    'addGroupBy',
    'addOrderBy',
    'limit',
  ] as const) {
    qb[method].mockReturnValue(qb);
  }

  return qb;
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let tracksQueryBuilder: QueryBuilderMock;

  beforeEach(async () => {
    tracksQueryBuilder = createQueryBuilderMock([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(Earnings),
          useValue: {
            createQueryBuilder: jest.fn(() => createQueryBuilderMock([])),
          },
        },
        {
          provide: getRepositoryToken(Track),
          useValue: {
            createQueryBuilder: jest.fn(() => tracksQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Tip),
          useValue: {
            createQueryBuilder: jest.fn(() => createQueryBuilderMock([])),
          },
        },
      ],
    }).compile();

    service = module.get(AnalyticsService);
  });

  it('orders top tracks by aggregate expression, not camelCase alias', async () => {
    await service.getDashboard('artist-id');

    expect(tracksQueryBuilder.orderBy).toHaveBeenCalledWith(
      'COALESCE(SUM(e.amount), 0)',
      'DESC',
    );
    expect(tracksQueryBuilder.orderBy).not.toHaveBeenCalledWith('netEarnings', 'DESC');
    expect(tracksQueryBuilder.addOrderBy).toHaveBeenCalledWith('t.plays', 'DESC');
    expect(tracksQueryBuilder.limit).toHaveBeenCalledWith(10);
  });
});
