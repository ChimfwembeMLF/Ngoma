import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'platform_settings' })
export class PlatformSettings {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'jsonb', default: {} })
  theme: Record<string, string>;

  @Column({ name: 'theme_preset_id', length: 50, default: 'spotify' })
  themePresetId: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
