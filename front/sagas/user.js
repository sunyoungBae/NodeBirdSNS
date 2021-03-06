import { all, fork, call, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOG_IN_REQUEST, LOG_IN_FAILURE, LOG_IN_SUCCESS,
    LOG_OUT_REQUEST, LOG_OUT_FAILURE, LOG_OUT_SUCCESS,
    SIGN_UP_REQUEST, SIGN_UP_FAILURE, SIGN_UP_SUCCESS,
    FOLLOW_REQUEST, FOLLOW_FAILURE, FOLLOW_SUCCESS,
    UNFOLLOW_REQUEST, UNFOLLOW_FAILURE, UNFOLLOW_SUCCESS,
} from '../reducers/user';

function followAPI(data) {
    return axios.post('/api/follow') // api 실행
}

function* follow(action) {
    try {
        // const result = yield call(followAPI); // api 요청의 결과를 받음.
        yield delay(1000);
        yield put( {
            type: FOLLOW_SUCCESS,
            data: action.data
        });
    } catch(err) {
        yield put({
            type: FOLLOW_FAILURE,
            error: err.response.data
        });
    } 
}

function unfollowAPI(data) {
    return axios.post('/api/unfollow') // api 실행
}

function* unfollow(action) {
    try {
        yield delay(1000);
        // const result = yield call(unfollowAPI); // api 요청의 결과를 받음.
        yield put( {
            type: UNFOLLOW_SUCCESS,
            data: action.data
        });
    } catch(err) {
        yield put({
            type: UNFOLLOW_FAILURE,
            error: err.response.data
        });
    } 
}

function logInAPI(data) {
    return axios.post('/api/login') // api 실행
}

function* logIn(action) {
    try {
        yield delay(1000);
        // const result = yield call(logInAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: LOG_IN_SUCCESS,
            data: action.data
        });
    } catch(err) {
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data
        });
    } 
}

function logOutAPI() {
    return axios.post('/api/login') // api 실행
}

function* logOut() {
    try {
        yield delay(1000);
        // const result = yield call(logOutAPI); // api 요청의 결과를 받음.
        yield put( {
            type: LOG_OUT_SUCCESS,
            // data: result.data
        });
    } catch(err) {
        yield put({
            type: LOG_OUT_FAILURE,
            data: err.response.data
        });
    } 
}

function signUpAPI() {
    return axios.post('/api/signUp');
}

function* signUp() {
    try {
        yield delay(1000);
        // const result = yield call(signUpAPI); // api 요청의 결과를 받음.
        yield put( {
            type: SIGN_UP_SUCCESS,
        });
    } catch(err) {
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data
        });
    } 
}
function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnFollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLogIn() {
    yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
    yield all([
        fork(watchFollow),
        fork(watchUnFollow),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchSignUp),
    ])
}