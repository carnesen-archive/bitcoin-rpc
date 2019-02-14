import { sendData as subject } from '../send-data';
import { EventEmitter } from 'events';

jest.mock('http', () => ({
  request() {
    const req = new EventEmitter();
    setTimeout(() => {
      req.emit('error', { code: 'bah', message: 'humbug' });
    }, 0);
    (req as any).end = () => {};
    return req;
  },
}));

describe(subject.name, () => {
  it('throws "Failed to parse" if response data is not parsable', async () => {
    try {
      await subject('http://foo', 'bar');
      throw new Error('This line should not be reached');
    } catch (ex) {
      expect(ex.code).toMatch('bah');
      expect(ex.message).toMatch('humbug');
    }
  });
});
