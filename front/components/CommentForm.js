import {Form, Input, Button} from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({post}) => {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id);
    const {addCommmentDone} = useSelector((state) => state.post);
    const [commentText, onChangeCommentText, setCommentText] = useInput('');

    useEffect(() => {
        if(addCommmentDone) {
            setCommentText('');
        }
    }, [addCommmentDone])

    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText);
        dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {content: commentText, postId: post.id, userId, id},
        });
    }, [commentText,  id]);

    return (
        <Form onFinish={onSubmitComment}>
            <Form.Item style={{position: 'relative', margin: 0}}>
                <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
                <Button style={{ position: 'absolute', right: 0, bottom: -40 }} type="primary" htmlType="submit">삐약</Button>
            </Form.Item>
        </Form>
    );
};

CommentForm.protoTypes = {
    post: PropTypes.object.isRequired,
};

export default CommentForm;