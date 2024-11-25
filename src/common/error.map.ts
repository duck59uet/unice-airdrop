export const ErrorMap = {
  SUCCESSFUL: {
    Code: 'SUCCESSFUL',
    Message: 'Successfully!',
  },
  UNAUTHRORIZED: {
    Code: 'E401',
    Message: 'Unauthorized',
  },
  NOT_FOUND: {
    Code: 'E001',
    Message: 'Not found',
  },
  E400: {
    Code: 'E400',
    Message: 'Bad request',
  },
  E403: {
    Code: 'E401',
    Message: 'Unauthorized',
  },
  REQUEST_ERROR: {
    Code: 'E039',
    Message: 'Request to server error',
  },
  USER_NOT_FOUND: {
    Code: 'E040',
    Message: 'User not found',
  },
  FOLLOWER_EXISTED: {
    Code: 'E041',
    Message: 'Follower existed',
  },
  FOLLOWER_NOT_FOUND: {
    Code: 'E042',
    Message: 'Follower not found',
  },
  UPDATE_TOO_SOON: {
    Code: 'E043',
    Message: 'User can only update once in 24 hours',
  },
  E500: {
    Code: 'E500',
    Message: 'Server error',
  },
};
