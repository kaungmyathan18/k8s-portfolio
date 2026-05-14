import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '2m',  target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m',  target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
};

export default function () {
  const BASE_URL = 'http://localhost:8080';

  const responses = http.batch([
    ['GET', `${BASE_URL}/`],
    ['GET', `${BASE_URL}/health`],
    ['GET', `${BASE_URL}/info`],
  ]);

  responses.forEach(res => {
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
  });

  sleep(0.1);
}