import { all, fork, call, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE
} from '../reducers/post';

function addPostAPI(data) {
    return axios.post('/api/post', data) // api 실행
}

function* addPost(action) {
    try {
        yield delay(1000);
        // const result = yield call(addPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: ADD_POST_SUCCESS,
            // data: result.data
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
function addCommentAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data) // api 실행
}

function* addComment(action) {
    try {
        yield delay(1000);
        // const result = yield call(addPostAPI, action.data); // api 요청의 결과를 받음.
        yield put( {
            type: ADD_COMMENT_SUCCESS,
            // data: result.data
        });
    } catch(err) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data
        });
    } 
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addPost);
}

export default function* postSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchAddComment),
    ])
}