import { all, fork, call, put, take } from 'redux-saga/effects';
import axios from 'axios';

function logInAPI(data) {
    return axios.post('/api/login') // api 실행
}

function* logIn(action) {
    try {
        const result = yield call(logInAPI, action.data); // api 요청의 결과를 받음.
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

function logOutAPI() {
    return axios.post('/api/login') // api 실행
}

function* logOut() {
    try {
        const result = yield call(logOutAPI); // api 요청의 결과를 받음.
        yield put( {
            type: 'LOG_OUT_SUCCESS',
            data: result.data
        });
    } catch(err) {
        yield put({
            type: 'LOG_OUT_FAILURE',
            data: err.response.data
        });
    } 
}

function addPostAPI(data) {
    return axios.post('/api/post', data) // api 실행
}

function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: 'ADD_POST_SUCCESS',
            data: result.data
        });
    } catch(err) {
        yield put({
            type: 'ADD_POST_FAILURE',
            data: err.response.data
        });
    } 
}

function* watchLogIn() {
    yield take('LOG_IN_REQUEST', logIn);
}

function* watchLogOut() {
    yield take('LOG_OUT_REQUEST', logOut);
}

function* watchAddPost() {
    yield take('ADD_POST', addPost);
}

export default function* rootSaga() {
    yield all([ // 등록
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchAddPost),
    ]);
}