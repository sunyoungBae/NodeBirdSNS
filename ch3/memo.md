# 리덕스 설치와 필요성 소개
next-redux-wrapper

npm i next-redux-wrapper
6.0.2 버전

npm i redux

### 필요성
여러 컴포넌트에서 쓰이는 공통적인 데이터가 존재.
이 부분을 관리하기 위해 부모 컴포넌트에서 데이터를 들고 있고, 자식 컴포넌트에서 부모 컴포넌트의 데이터를 내려받아서 사용한다.
이러한 과정들이 귀찮기 때문에 해결.(데이터 전달, 일치하도록 동기화?)
중앙에서 하나로 관리를 해서 컴포넌트에게 뿌려주는 중앙데이터 저장소 역할을 하는 것이 redux이다.

* react - context API, redux, mobx...
* 고르는 방법
  * 규모가 크면 redux, mobx
    * redux : 원리가 매우 간단해서, 에러가 나도 잘 해결됨(추적이 잘됨). 앱이 안정적. 대신 코드량이 많아짐. 초보 추천.
    * mobx : redux 보다 코드량이 적다. 실수 하면 트레킹이 어렵다. 
  * 규모가 크지 않으면 contextAPI
* 기능별 장단점
  * 비동기 동작(요청, 성공, 실패)
    * redux, mobx : 구현되어있음
    * contextAPI : 직접 구현해야함
  * 규모가 커지면 중앙 데이터 저장소가 커지기 때문에 나눠야할 필요성이 생김
    * redux : reducer를 쪼갤 수 있다.

`<Provider store={store}>`는 react-redux에 존재하며, next에서는 사용하지 않음
* next-redux-wrapper에서 알아서 감싸준다.

# 리덕스의 원리와 불변성
### 원리
* 데이터 중앙 저장소 : App에 대한 전체 상태(state)
* action : 데이터 변경시 필수 요소(type, data가 존재). 히스토리를 남기기 위해?
* dispatch : action을 dispatch하면 실제로 중앙 저장소의 데이터가 변경된다.
* reducer : action을 dispath했을 때 실제로 중앙 저장소의 데이터가 어떻게 변경되어야하는 지 규칙을 적어주는 곳

새로운 데이터를 변경할 때마다 action을 만들어야한다. 또, action을 실제로 처리하는 부분을 추가해야한다.
* 장점
  * action이 모두 redux에 기록이 되어서 지금까지 어떻게 변경되었는지 내용들이 추적이 가능하다.
    * 버그 잡기 쉬움
    * 거꾸로 거슬로 올라갈 수 있어서(타임머신)(redux-devtool)
      * 개발 테스트 용이
* 단점
  * 코드량이 많아짐

### 불변성(immutability)
reducer 내부에 `return { ...state, ... }`을 꼭 적어준다.
* JS에서 `{} === {}`는 `false`이기 때문에(참조 대입은 `true`) 항상 변경하고 싶은 부분만 변경하고 새로 만든 객체를 리턴한다.
  * 객체를 새로 만들어야 이전 기록과 다음 기록이 그대로 남아있고 이를 사용해 변경내역들이 추적이 가능해진다.

* 데이터를 일일히 적지않고 `...state`(비구조화 할당)를 사용하는 이유?
  * 메모리를 아끼기 위해
    * 내부 프로퍼티중 객체인 값이 유지해도 되는 경우는 새로운 객체를 또 만드는 게 아니라 참조 관계를 유지한다.

개발 모드일 때는 history를 다 가지고 있지만, 배포 모드이면 history를 중간중간에 버린다.(메모리 문제 발생X)
* history를 가진다 = 참조(메모리)를 유지한다.

값이 변경되면 redux가 react component들한테 알려준다?

# 리덕스 실제 구현하기
위치
* front/store/configureStore.js
* front/reducers/index.js
### store
store = state + reducer
* 생성
    ```javascript
    import { createStore } from 'redux';
    const store = createStore(reducer, enhancer);
    ```
* dispatch : `store.dispatch({ type: 'CHANGE_NICKNAME', data: 'boogicho' })`
  * 파라미터에는 action 객체가 들어감

### action 과 action creator
action은 객체이므로 값을 수정을 할 수 없어서 `data`변경시 매번 생성해줘야하는 데, 이 불편함을 덜기 위해 동적으로 액션을 만들어주는 **action creator**를 만들어서 dispatch시 사용한다.
```javascript
// action creator
const changeNickname = (data) => {
  return {
      type: 'CHANGE_NICKNAME',
      data,
  }
}

// store에서 action creator를 사용해 dispatch
store.dispatch(changeNickname('boogicho'))
```

### reducer
(이전 상태, 액션)을 통해 => 다음 상태를 생성
```javascript
const initialState = { // 최초 상태
    name: 'zerocho',
    age: 27,
    password: 'babo',
};

const rootReducer = ((state = initialState, action) => {
  switch(action.type) {
    case 'CHANGE_NICKNAME':
      return {
          ...state,
          name: action.data,
      }
  }
});
```

### useSelector
다른 컴포넌트에서 redux에 존재하는 state를 가져와서 사용할 수 있다.
가져온 state가 변경되면 해당 컴포넌트는 자동으로 리렌더링된다.
```javascript
import { useSelector } from 'react-redux';
const AppLayout = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    ...
}
```

### useDispatch
`store.dispatch`와 동일하며, 다른 컴포넌트에서 아래처럼 사용 가능하다.
```javascript
import { useDispatch } from 'react-redux';
import { loginAction } from "../reducers";
const LoginForm = () => {
    const dispatch = useDispatch();
    ...

    const onSubmitForm = useCallback((e) => {
        dispatch(loginAction({id, password}));
    }, [id, password]);
  ...
}
```

# 미들웨어와 리덕스 데브툴즈
action을 기록하고 싶으면 middleware를 붙여야한다.
```javascript
import { applyMiddleware, compose, createStore } from 'redux';
import reducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const configureStore = () => {
    const middlewares = [];
    const enhancer = process.env.NODE_ENV === 'production'
        ? compose(applyMiddleware(...middlewares))
        : composeWithDevTools(applyMiddleware(...middlewares)); // dev툴 연결
    const store = createStore(reducer, enhancer);
    ...
}
```

리덕스 데브툴즈 설치 : 브라우저 개발자 도구와 연동이 됨
`npm i redux-devtools-extension`

히스토리를 옮겨 다닐 수 있다. => 불변성으로 데이터를 유지해서

# 리듀서 쪼개기
1. 각 파일로 쪼개서 initial state, reducer, action creator를 옮긴다.
2. 메인이 되는 파일(index.js)에서 `import { combineReducers } from 'redux';`을 사용해 합친다.
   ```javascript
   import user from './user';
   import post from './post';
   import { combineReducers } from 'redux';
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
   ```
   1. `user`, `post`의 `initalState`는 `combineReducers`가 알아서 합쳐준다.


# 더미데이터와 포스트폼 만들기
action type을 `const`로 저장하면 `reducer`에서 사용시 오타가 방지된다.
```javascript
const ADD_POST = 'ADD_POST'; // action 이름을 상수로 하면, 값을 재활용할 수 있다. 오타 방지.(reducer)
export const addPost = {
    type: ADD_POST
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_POST:
            return {
                ...state
            }
        default:
            return state;
    }
};
```

# 게시글 구현하기
...

# 댓글 구현하기
...

# 이미지 구현하기

# 이미지 캐루셀 구현하기(react-slick)
react-slick : 캐루셀 중에 가장 유명한 컴포넌트

설치 : `npm i react-slick`

각 옵션은 공식문서에 존재.

# 글로벌 스타일과 컴포넌트 폴더 구조

# 게시글 해시태그 링크로 만들기