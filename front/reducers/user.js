

export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpdata: {},
    loginData: {},
};

// action creator : 동적으로 액션을 만들어줌
// 액션은 원래 객체여서 값을 수정을 할 수 없으므로, 동적으로 액션을 만들어주는 action creator를 만들어서 dispatch시 사용하면 된다.
export const loginAction = (data) => {
    return {
        type: 'LOG_IN',
        data,
    }
}

export const logoutAction = () => {
    return {
        type: 'LOG_OUT',
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