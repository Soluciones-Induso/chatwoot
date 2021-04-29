import { getTypingUsersText, createPendingMessage } from '../commons';

describe('#getTypingUsersText', () => {
  it('returns the correct text is there is only one typing user', () => {
    expect(getTypingUsersText([{ name: 'Pranav' }])).toEqual(
      'Pranav está escribiendo'
    );
  });

  it('returns the correct text is there are two typing users', () => {
    expect(
      getTypingUsersText([{ name: 'Pranav' }, { name: 'Nithin' }])
    ).toEqual('Pranav and Nithin are typing');
  });

  it('returns the correct text is there are more than two users are typing', () => {
    expect(
      getTypingUsersText([
        { name: 'Pranav' },
        { name: 'Nithin' },
        { name: 'Subin' },
        { name: 'Sojan' },
      ])
    ).toEqual('Pranav Y otros 3 estan escribiendo');
  });
});

describe('#createPendingMessage', () => {
  const message = {
    message: 'hi',
  };
  it('returns the pending message with expected new keys', () => {
    expect(createPendingMessage(message)).toHaveProperty(
      'content',
      'id',
      'status',
      'echo_id',
      'status',
      'created_at',
      'message_type',
      'conversation_id'
    );
  });

  it('returns the pending message with status progress', () => {
    expect(createPendingMessage(message)).toMatchObject({
      status: 'progress',
    });
  });

  it('returns the pending message with same id and echo_id', () => {
    const pending = createPendingMessage(message);
    expect(pending).toMatchObject({
      echo_id: pending.id,
    });
  });

  it('returns the pending message with attachmnet key if file is passed', () => {
    const messageWithFile = {
      message: 'hi',
      file: {},
    };
    expect(createPendingMessage(messageWithFile)).toHaveProperty(
      'content',
      'id',
      'status',
      'echo_id',
      'status',
      'created_at',
      'message_type',
      'conversation_id',
      'attachments',
      'private'
    );
  });

  it('returns the pending message to have one attachment', () => {
    const messageWithFile = {
      message: 'hi',
      file: {},
    };
    const pending = createPendingMessage(messageWithFile);
    expect(pending.attachments.length).toBe(1);
  });
});
