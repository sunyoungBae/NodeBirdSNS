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
FLOW 이해
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
...

# 바뀐 상태 적용하고 eslint 점검하기
...

# 게시글, 댓글 saga 작성하기

### 복잡한 구조의 데이터를(댓글 추가) 불변성에 맞게 변경하는 법
comment 구조
```javascript
mainPosts: [{
    id: 1,
    User: { }, // 게시글 작성자
    content: '', // 게시글 내용
    Images: [], // 게시글 이미지
    Comments: [{    // 댓글
        User: { // 댓글 작성자
            nickname: 'nero',
        },
        content: '우와 개정판이 나왔군요~', // 댓글 내용
    }, ...]
}],
```

댓글 추가시 `mainPosts`에 불변성을 유지하며 추가하는 법
```javascript
// 게시글의 id로 게시글 index 찾기
const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
// target 게시글 복사 후 댓글만 앞에 추가
const post = { ...state.mainPosts[postIndex] };
post.Comments = [dummyComment(action.data.content), ...post.Comments];
// 현재 mainPosts에서 변경된 것만 반영
const mainPosts = [...state.mainPosts];
mainPosts[postIndex] = post;
```

### Tips
Warning: Encountered two children with the same key, `2`.
* 게시글 id가 고정값이여서 동일한 key가 있다는 에러 발생
* id를 랜덤하게 만들기
  * npm i shortid
    * 겹치기 힘든 아이디를 생성

# 게시글 삭제 saga 작성하기
### 게시글 추가시 사용자 정보에도 연동하기
현재 게시글은 post reducer, 사용자 정보는 user reducer에 있다.
* 각 reducer에서는 내부의 정보만 변경할 수 있다. ex) post reducer에서는 user reducer의 정보를 직접적으로 변경할 수 없다.

게시글 추가시 사용자 정보를 연동하기 위해서는 user reducer에 액션을 추가해 post reducer에서 호출하면 된다.
* why?
  * 데이터 변경은 action을 통해서만 변경할 수 있다.
  * saga는 여러 액션을 동시에 디스패치 가능하다.
* 방법
  * user reducer
    * 내 게시글 추가 액션 생성 : `ADD_POST_TO_ME`
    * 액션이 디스패치될 때 동작 정의
  * post saga에서 게시글 등록시 user 액션을 호출한다.
    ```javascript
    yield put( {
        type: ADD_POST_TO_ME,
        data: id,
    });
    ```

### 게시글 삭제
게시글 삭제는 filter 함수를 이용한다.
`Posts: state.me.Posts.filter((v) => v.id !== action.data)`

# immer 도입하기
대부분의 경우 ... 연산자 또는 배열 내장함수를 사용하는건 그렇게 어렵지는 않지만 데이터의 구조가 조금 까다로워지면 불변성을 지켜가면서 새로운 데이터를 생성해내는 코드가 조금 복잡해집니다.

=> immer가 자동으로 불변성을 지켜주기 때문에 불변성을 지키지 않고 코드를 작성할 수 있어 편하다.

ie11도 지원.

설치 : `npm i immer`

### 예제
이전 : `state.mainPosts : [dummyPost(action.data), ...state.mainPosts]`
이후 : `draft.mainPosts.unshift(dummyPost(action.data));`

이전
```javascipt
case ADD_COMMENT_SUCCESS:
    const postIndex = state.mainPosts.findIndex((v) => v.id !== action.data); // 게시글의 id로 게시글 index 찾기
    const post = { ...state.mainPosts[postIndex] };
    post.Comments = [dummyComment(action.data.content), ...post.Comments];
    const mainPosts = [...state.mainPosts];
    mainPosts[postIndex] = post;
    return {
        ...state,
        mainPosts,
        addCommentLoading: false,
        addCommentDone: true,
    }
```

이후
```javascript
case ADD_COMMENT_SUCCESS:
    const post = draft.mainPosts.find((v) => v.id === action.data.postId);
    post.Comments.unshift(dummyComment(action.data.content));
    draft.addCommentLoading = false;
    draft.addCommentDone = true;
```

# faker로 실감나는 더미데이터 만들기
`npm i -D faker@5`

더미 이미지
* placeholder.com : 이미지 크기만 있고, 크기에 맞게 공간 차지

```javascript
initialState.mainPosts = initialState.mainPosts.concat(
    Array(20).fill().map(() => ({
        id: shortId.generate(),
        User: {
            id: shortId.generate(),
            nickname: faker.name.findName()
        },
        content: faker.lorem.paragraph(),
        Images: [{
            src: faker.image.imageUrl(),
        }],
        Comments: [{
            User: {
                id: shortId.generate(),
                nickname: faker.name.findName()
            },
            content: faker.lorem.sentence(),
        }],
    }))
);
```

### 효과
백엔드가 만들어지지 않아도 더미데이터를 통해 **프론트를 미리 구현**할 수 있다.
* 데이터 구조는 미리 협의 필요.

더미 데이터를 만들면 **성능 테스트**를 쉽게 할 수 있다.
* 수천개의 데이터 추가새 성능 테스트
* 무한 스크롤링 테스트

### 리다이렉트

```javascript
import Router from 'next/router';

Router.push('/'); // redirect
```

### redux-toolkit : to do list
redux 공식팀에서 간단하게 코드를 짤 수 있게 제공
* ex) `switch` 문을 줄일 수 있음

# 인피니트 스크롤링 적용하기
무한 스크롤링 : 스크롤 할 때마다 서버에서 특정 단위로 데이터를 가져오는 것.
### 스크롤시 추가할 게시글 더미 데이터 생성
reducer > post.js > generateDummyPost()
* 서버에서 불러오는 것을 대체
* faker, shortId 사용

### 로드시 게시글 호출
* 메인 페이지가 로드되면 게시글이 최초 한번 호출
  * useEffect 사용(pages > index.js)

### scroll detecting
* useEffect 사용(pages > index.js)
* 현재 끝 지점 전 300px 앞에서 게시글 로딩 호출
* 중복 호출 문제 발생 : 아래 두개를 사용해 해결
  1. `throttle`를 사용(sagas > post.js)
     * 지정된 시간 동안 한번만 실행하도록 수정.
     * 단점 : 응답을 차단하지 요청은 차단하지 않는다. 따라서 호출된 요청은 무조건 처리한다.
  2. 처음 부터 요청을 보내지 않도록 조건문 추가(pages > index.js : 조건 추가, sagas > post.js : 상태 관리)
     * `hasMorePost`, `loadingPostLoading` 사용


### react-virtualized : to do list
스크롤을 많이해서 화면에 너무 많은 게시글이 렌더링되면 메모리가 터져버릴 수 있음.(특히 모바일) 이때 react-virtualized를 사용하면 됨.
* 화면에 보이는 맥시멈 개수의 게시글만 화면에 보여주고 나머지는 메모리에 저장시킴