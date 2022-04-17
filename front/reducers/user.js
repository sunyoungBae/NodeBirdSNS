import produce from 'immer';

export const initialState = {
    logInLoading: false, // 로그인 시도 중
    logInDone: false,
    logInError: null,
    logOutLoading: false, // 로그아웃 시도 중
    logOutDone: false,
    logOutError: null,
    signUpLoading: false, // 회원가입 시도 중
    signUpDone: false,
    signUpError: null,
    changeNicknameLoading: false, // 닉네임 변경 시도 중
    changeNicknameDone: false,
    changeNicknameError: null,
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

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

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
    Posts: [{id: 1}],
    Followings: [{ nickname: 'test1' }, { nickname: 'test2' }, { nickname: 'test3' }],
    Followers: [{ nickname: 'test1' }, { nickname: 'test2' }, { nickname: 'test3' }],
});

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch(action.type) {
            case LOG_IN_REQUEST:
                draft.logInLoading = true;
                draft.logInError = null;
                draft.logInDone = false;
                break;
            case LOG_IN_SUCCESS:
                draft.logInLoading = false;
                draft.logInDone = true;
                draft.me = dummyUser(action.data);
                break;
            case LOG_IN_FAILURE:
                draft.logInLoading = false;
                draft.logInDone = false;
                draft.logInError = action.error;
                break;
            case LOG_OUT_REQUEST:
                draft.logOutLoading = true;
                draft.logOutError = null;
                draft.logOutDone = false;
                break;
            case LOG_OUT_SUCCESS:
                draft.logOutLoading = false;
                draft.logOutDone = true;
                draft.me = null;
                break;
            case LOG_OUT_FAILURE:
                draft.logOutLoading = false;
                draft.logOutError = action.error;
                draft.me = null;
                break;
            case SIGN_UP_REQUEST:
                draft.signUpLoading = true;
                draft.signUpError = null;
                draft.signUpDone = false;
                break;
            case SIGN_UP_SUCCESS:
                draft.signUpLoading = false;
                draft.signUpDone = true;
                break;
            case SIGN_UP_FAILURE:
                draft.signUpLoading = false;
                draft.signUpError = action.error;
                draft.me = null;
                break;
            case CHANGE_NICKNAME_REQUEST:
                draft.changeNicknameLoading = true;
                draft.changeNicknameError = null;
                draft.changeNicknameDone = false;
                break;
            case CHANGE_NICKNAME_SUCCESS:
                draft.changeNickNameLoading = false;
                draft.changeNickNameDone = true;
                break;
            case CHANGE_NICKNAME_FAILURE:
                draft.changeNickNameLoading = false;
                draft.changeNickNameError = action.error;
                break;
            case ADD_POST_TO_ME:
                draft.me.Posts.unshift({id: action.data})
                break;
            case REMOVE_POST_OF_ME:
                draft.me.Posts.filter((v) => v.id !== action.data);
                break;
            default:
                break;
        }
    });
};

export default reducer;