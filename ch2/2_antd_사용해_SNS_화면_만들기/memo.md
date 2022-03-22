# antd와 styled-components
antd : ant design
* 혼자 개발시 디자이너가 없어도 그럴듯하게 디자인되어있다.
* 개성이 사라짐

styled-components
* 컴포넌트 자체에 CSS 미리 입혀서 컴포넌트로 만듬

설치 cmd : `npm i antd styled-components @ant-design/icons`
* antd 페이지에서 하고싶은 컴포넌트를 선택해서 쓰면 된다.
  * https://ant.design/components/overview/

# NextJs : _app.js와 Head
[_app.js](https://nextjs.org/docs/basic-features/built-in-css-support#adding-a-global-stylesheet) : 모든 페이지에서 공통인 부분을 담당

xxxLayout.js : 특정 컴포넌트끼리 공통인 부분은 Layout을 만들어서 개별 컴포넌트를 감싸면 된다.

[`<Head>` 변경 방법](https://nextjs.org/docs/api-reference/next/head)
* 기본적으로 `render()`내부에 설정하는 것을 `<body>`태그 내부를 변경하는 것이다.
* next.js에서 제공하는 `<Head>`용 컴포넌트 사용
  * `import Head from 'next/head'
  * `render()`내부에 `<Head>`태그로 감싸서 설정 가능(pages/_app.js 참고)

# Ant Design : 반응형 그리드 사용하기
* 적응형? 반응형?
  * 적응형 : 모바일, 데스크탑, 태블릿 페이지 따로
  * 반응형 : 처음엔 모바일이였다가 점점 늘어남에따라 컴포넌트가 재배치되면서 화면이 바뀜(데스크탑, 태블릿)
    * 모바일 먼저 디자인해야함. 반대로하면 힘들어짐.(데스크탑부터 하면 브레이크포인트 설정이 골때려짐)??

디자인 순서
* 가로 디자인 > 세로 디자인
* 모바일 > 데스크탑

### [Grid](https://ant.design/components/grid/)
반응형 디자인 preset
* xs : 모바일
* sm : 태블릿
* md : 작은 데스크탑

사이즈
* 자리차지 : n/24 기준
* 한 줄에 col값이 24가 넘어가면 다음 줄로 넘어감

gutter
* 컬럼 사이에 간격을 둠(padding)

# 로그인 폼 만들기(LoginForm.js 참고)
id, password를 입력받는 로그인 폼 생성
* id, password는 useState로 선언
* onChangeXX(Id or Password) : useCallback으로 선언
  * 컴포넌트의 props로 넘겨주는 함수는 useCallback 꼭사용! 그래야 최적화가 된다.
* antd > Button, Form, Input을 사용해 UI 구성
* next > link를 사용해 "회원 가입"버튼 링크 구성

# 리렌더링 이해하기
태그에 style 지정시 객체로 하면 안된다.
* ex) `<div style={{ marginTop: 10 }}>`
* JS에서 객체는 생성될때마다 서로 다른 것 (`{} === {}` => `false`)
* 리렌더링시 style내 객체 선언 때문에 그 부분이 모두 리렌더링된다.
  * 버츄얼 돔으로 검사하면서 style내 객체가 다르다고 판단.
* 해결방법1 : `styled-components` 사용헤 스타일을 적용한 컴포넌트 생성
  * 이슈 발생 코드
    ```javascript
    <div style={{ marginTop: 10 }}>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
            <Link href="/signup"><a><Button>회원가입</Button></a></Link>
    </div>
    ```
  * 이슈 해결 코드
    ```javascript
    <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
            <Link href="/signup"><a><Button>회원가입</Button></a></Link>
    </ButtonWrapper>
    ```
    * 스타일 적용한 컴포넌트 생성
      ```javascript
      const ButtonWrapper = styled.div`
        margin-top: 10px;
      `;
      ```
      * 기본 HTML 태그가 아니라 컴포넌트를 감싸려면 `styled(Input.Search)` 사용
* 해결방법2 : `useMemo`를 사용해 값을 저장
  ```javascript
  const style = useMeno(() => ({marginTop: 10}), [])
  ```
  ```javascript
  <div style={style}>
  </div>
  ```
* 성능에 크게 영향이 없다면 그냥 인라인 스타일 써도 됩니다. 너무 집착할 필요는 없어요.

리렌더링의 범위
* Hooks는 함수 내부가 다시 실행
  * useCallbak, useMemo는 캐싱 : 배열 부분이 바뀌지 않는 이상 이전 컴포넌트랑 동일(바뀌지 않음)
* return 내부에서는 바뀌는 부분만 다시 그림

# 더미 데이터로 로그인하기
Form 에서 submit되면 onFinish가 호출됨
* `<Form onFinish={onSubmitForm}>`
* onFinish는 preventDefault가 자동으로 되어있음

# 크롬 확장프로그램과 Q&A
* 뷰랑 제이쿼리 같이 쓰면 안 좋은 점
  * 리액트, 뷰는 데이터가 변경될때 알아서 다시 그려주는 것이 장점.
  * 제이쿼리는 자기가 직접 자기 화면을 다시 그려야한다. 같이 쓰면 리액트와 뷰의 장점이 사라짐.

# 프로필 페이지 만들기
1. render() 코드 입력시 HTML 태그(`<div>`)가 아닌 큼직한 클래스를 생성하고, 전달할 더미데이터를 생성
   ```javascript
   const Profile = () => {
       const followerList = [{nickname: '제로초'}, {nickname: 'tlskd'}, {nickname: '다리아파'}]
       const followingList = [{nickname: '제로초'}, {nickname: 'tlskd'}, {nickname: '다리아파'}]
       return (
           <>
               <Head>
                   <title>내 프로필 | NodeBird</title>
               </Head>
               <AppLayout>
                   <NicknameEditForm />
                   <FollowList header="팔로잉 목록" data={followerList}/>
                   <FollowList header="팔로워 목록" data={followingList}/>
               </AppLayout>
           </>
       );
   };
   ```
2. 사용한 클래스들마다 `components`폴더에 파일을 만들고 세부 구현


# 회원가입 페이지 만들기(커스텀 훅)
동일한 코드가 존재할때 커스텀 훅을 사용할 수 있다.
### 커스텀 훅 정의 : hooks/userInput.js
```javascript
import { useState, useCallback } from "react";

export default (initialValue = null) => {
    const [value, setValue] = useState(initialValue);
    const handler = useCallback((e) => {
        setValue(e.target.value);
    }, []);
    return [value, handler];
}
```
### 커스텀 훅 사용 : pages/signUp.js, components/LoginForm.js
```javascript
import useInput from "../hooks/useInput";

const LoginForm = ({ setIsLoggedIn }) => {
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    ...
}
```