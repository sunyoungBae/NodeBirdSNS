

export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpdata: {},
    loginData: {},
};

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
        type: 'LOG_IN_REQUEST',
        data,
    }
}

export const loginSuccessAction = (data) => {
    return {
        type: 'LOG_IN_SUCCESS',
        data
    }
}

export const loginRequestFailure = (data) => {
    return {
        type: 'LOG_IN_FAILURE',
        data
    }
}

export const logoutRequestAction = () => {
    return {
        type: 'LOG_OUT_REQUEST',
    }
}

export const logoutSuccessAction = () => {
    return {
        type: 'LOG_OUT_SUCCESS',
    }
}

export const logoutRequestFailure = () => {
    return {
        type: 'LOG_OUT_FAILURE',
    }
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOG_IN':
            return {
                ...state,
                isLoggedIn: true,
                me: action.data,
            }
        case 'LOG_OUT':
            return {
                ...state,
                isLoggedIn: false,
                me: null,
            }
        default:
            return state;
    }
};

export default reducer;