const url = 'https://m.youtube.com/watch?v=123';
const parsedUrl = new URL(url);
const hostname = parsedUrl.hostname.replace('www.', '');
console.log(hostname);
