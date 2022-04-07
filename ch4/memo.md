# redux-thunk 이해하기
redux의 middleware 중 하나
* middleware : redux의 기능을 향상시키는 역할. redux에 없던 기능을 추가해주는 역할.

redux가 비동기 action을 dispath할 수 있도록 도와주는 역할

https://github.com/reduxjs/redux-thunk

장점 : 하나의 비동기 액션에서 여러 개의 동기 액션을 dispatch 할 수 있다.

사용법
```javascript
import thunkMiddleware from 'redux-thunk';

const configureStore = () => {
    const middlewares = [thunkMiddleware];  // 여기에 추가
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares)); // dev툴 연결
    const store = createStore(reducer, enhancer);
    store.dispatch({
        ...
    })
    return store;
};

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
```

thunk에 비해 saga가 지원하는 기능이 더 많다.

# saga 설치하고 generator 이해하기
saga는 generator를 사용한다.

# saga 이펙트 알아보기
saga 이펙트에는 all, fork, call, put이 존재한다.

이펙트 앞에는 항상 `yield`를 붙인다.

all([]) : 배열 안에 있는 것은 모두 실행한다. **동시에 실행**할 수 있게 한다.

fork(fun, funParam...), call(fun, funParam...) : 제너레이터 함수(fun)를 실행한다. 실행시 두번째 인자부터는 함수(fun)의 파라미터로 넘어간다.
* fork : 비동기 함수 호출
* call : 동기 함수 호출

put(object) : action을 dispatch하는 것과 유사

take(action_creator, action) : action_creator가 들어오면 action이 실행되고 완료될 때까지 기다린다.(비동기)

```javascript
import { all, fork, call, put, take } from 'redux-saga/effects';
import axios from 'axios';

function logInAPI() {
    return axios.post('/api/login') // api 실행
}

function* logIn() {
    try {
        const result = yield call(logInAPI); // api 요청의 결과를 받음.
        yield put( {
            type: 'LOG_IN_SUCCESS',
            data: result.data
        });
    } catch(err) {
        yield put({
            type: 'LOG_IN_FAILURE',
            data: err.response.data
        });
    } 
}

function* watchLogIn() {
    yield take('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
    yield take('LOG_OUT_REQUEST');
}

function* watchAddPost() {
    yield take('ADD_POST');
}

export default function* rootSaga() {
    yield all([ // 등록
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchAddPost),
    ]);
}
```

제너레이터를 사용하면 `yield`를 사용해 테스트하기 편리해진다.
* `.next()`를 사용해 단계별로 테스트 가능