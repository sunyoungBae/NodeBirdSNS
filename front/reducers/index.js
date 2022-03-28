import { HYDRATE } from 'next-redux-wrapper';
import user from './user';
import post from './post';
import { combineReducers } from 'redux';

// (이전 상태, 액션)을 통해 => 다음 상태를 생성
const rootReducer = combineReducers({
    index: (state = {}, action) => {
        switch(action.type) {
            case HYDRATE:
                console.log('HYDRATE', action);
                return { ...state, ...action.payload };
            default:
                return state;
        }
    },
    user,
    post,
});

export default rootReducer;