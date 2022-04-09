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

function* watchLogIn() { // 이벤트 리스너 같은 역할
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

# take, take 시리즈, throttle 알아보기
`take`는 일회성이여서 한번 실행되면 사라진다.(`watchLogIn`)

사라지지 않게 하려면?
* `while(true)` 사용
  * 동기적으로 동작
* `takeEvery` 사용
  * 비동기로 동작
  * 반복문보다 직관적
* `takeLatest`
  * 클릭 실수로 여러 번 눌러질때 마지막 것만 실행
  * 여러번 요청에 대한 응답을 취소한다.
    * 서버쪽에서 같은 내용이 연달아 온건지 검사해야한다.
    * 요청은 취소할 수 없다.
  * 보통은 이걸 많이 쓴다.
* `takeLeading`
  * 첫번째 클릭만 실행

`throttle`
* 지정된 시간 동안 한번만 실행한다.
* `takeLatest`와 달리 요청도 제한을 둔다.
* `yield throttle('ACTION_REQUEST', action, 2000)`

# saga 쪼개고 reducer와 연결하기
FLOW
1. <LoginForm>
   1. id, password 적고 Login 버튼 클릭
   2. onSubmitForm > loginRequesetAction이 실행
2. reducers/user.js : sagas와 거의 동시해 실행됨
   1. reducer() > case 'LOG_IN_REQUEST' 실행
3. sagas/user.js
   1. watchLogIn() 실행
   2. logIn() 실행 : 1초 후 reducers > LOG_IN_SUCCESS 실행
4. reducers/user.js
   1. reducer() > case 'LOG_IN_SUCCESS' 실행
      1. isLoggedIn: true, `me`에 데이터가 들어감
5. AppLayout.js
   1. 변겅된 데이터에 맞게 다시 렌더링됨

# 액션과 상태 정리하기


# 바뀐 상태 적용하고 eslint 점검하기