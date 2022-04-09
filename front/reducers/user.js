export const initialState = {
    logInLoading: false, // 로그인 시도 중
    logInDone: false,
    logInError: null,
    logOutLoading: false, // 로그아웃 시도 중
    logOutDone: false,
    logOutError: null,
    signUpLoading: false, // 로그아웃 시도 중
    signUpDone: false,
    signUpError: null,
    me: null,
    signUpdata: {},
    loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

// action creator : 동적으로 액션을 만들어줌
// 액션은 원래 객체여서 값을 수정을 할 수 없으므로, 동적으로 액션을 만들어주는 action creator를 만들어서 dispatch시 사용하면 된다.
// redux-thunk를 사용해 비동기 액션 만들기
export const loginAction = (data) => {
    return (dispatch, getState) => {
        const state = getState(); // initial state
        dispatch(loginRequestAction()); // 요청보내기
        axios.post('/api/login')        // post로 서버에 요청
            .then((res) => {
                dispatch(loginSuccessAction(res.data));
            })
            .catch((err) => {
                dispatch(loginRequestFailure(err));
            });
    }
}


export const loginRequestAction = (data) => {
    return {
        type: LOG_IN_REQUEST,
        data,
    }
}

export const logoutRequestAction = () => {
    return {
        type: LOG_OUT_REQUEST,
    }
}

const dummyUser = (data) => ({
    ...data,
    nickname: 'zerocho',
    id: 1,
    Posts: [],
    Followings: [],
    Followers: [],
});

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case LOG_IN_REQUEST:
            return {
                ...state,
                logInLoading: true,
                logInError: null,
                logInDone: false,
            }
        case LOG_IN_SUCCESS:
            return {
                ...state,
                logInLoading: false,
                logInDone: true,
                me: dummyUser(action.data),
            }
        case LOG_IN_FAILURE:
            return {
                ...state,
                logInLoading: false,
                logInDone: false,
                logInError: action.error,
            }
        case LOG_OUT_REQUEST:
            return {
                ...state,
                logOutLoading: true,
                logOutError: null,
                logOutDone: false,
            }
        case LOG_OUT_SUCCESS:
            return {
                ...state,
                logOutLoading: false,
                logOutDone: true,
                me: null,
            }
        case LOG_OUT_FAILURE:
            return {
                ...state,
                logOutLoading: false,
                logOutError: action.error,
                me: null,
            }
        case SIGN_UP_REQUEST:
            return {
                ...state,
                signUpLoading: true,
                signUpError: null,
                signUpDone: false,
            }
        case SIGN_UP_SUCCESS:
            return {
                ...state,
                signUpLoading: false,
                signUpDone: true,
            }
        case SIGN_UP_FAILURE:
            return {
                ...state,
                signUpLoading: false,
                signUpError: action.error,
                me: null,
            }
        default:
            return state;
    }
};

export default reducer;