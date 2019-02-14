import { sendRequest as subject } from '../send-request';

jest.mock('../send-data');

describe(subject.name, () => {
  it('throws "Failed to parse" if response data is not parsable', async () => {
    try {
      await subject('foo', { method: 'foo' });
      throw new Error('This line should not be reached');
    } catch (ex) {
      expect(ex.message).toMatch('Failed to parse');
    }
  });
});
