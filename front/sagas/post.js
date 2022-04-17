import { all, fork, call, put, takeLatest, delay, throttle } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    LOAD_POST_REQUEST, LOAD_POST_SUCCESS, LOAD_POST_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    generateDummyPost
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';
import shortId from 'shortid';

function addPostAPI(data) {
    return axios.post('/api/post', data) // api 실행
}

function* addPost(action) {
    try {
        yield delay(1000);
        const id = shortId.generate()
        // const result = yield call(addPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: ADD_POST_SUCCESS,
            data: {
                id,
                content: action.data,
            },
        });
        yield put( {
            type: ADD_POST_TO_ME,
            data: id,
        });
    } catch(err) {
        yield put({
            type: ADD_POST_FAILURE,
            error: err.response.data
        });
    } 
}

function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function loadPostAPI(data) {
    return axios.get('/api/post', data) // api 실행
}

function* loadPost(action) {
    try {
        yield delay(1000);
        // const result = yield call(loadPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: LOAD_POST_SUCCESS,
            data: generateDummyPost(10),
        });
    } catch(err) {
        yield put({
            type: LOAD_POST_FAILURE,
            error: err.response.data
        });
    } 
}

function* watchLoadPosts() {
    yield throttle(5000, LOAD_POST_REQUEST, loadPost);
}

function removePostAPI(data) {
    return axios.delete('/api/post', data) // api 실행
}

function* removePost(action) {
    try {
        yield delay(1000);
        const id = shortId.generate()
        // const result = yield call(addPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: REMOVE_POST_SUCCESS,
            data: action.data,
        });
        yield put( {
            type: REMOVE_POST_OF_ME,
            data: action.data,
        });
    } catch(err) {
        yield put({
            type: REMOVE_POST_FAILURE,
            error: err.response.data
        });
    } 
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function addCommentAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data) // api 실행
}

function* addComment(action) {
    try {
        yield delay(1000);
        // const result = yield call(addPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: ADD_COMMENT_SUCCESS,
            data: action.data
        });
    } catch(err) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data
        });
    } 
}

function* watchAddComment() {
    console.log('watchAddComment')
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchLoadPosts),
        fork(watchRemovePost),
        fork(watchAddComment),
    ])
}