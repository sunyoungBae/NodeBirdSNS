import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout"
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useEffect } from "react";
import { LOAD_POST_REQUEST } from "../reducers/post";

const Home = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const {mainPosts, hasMorePost, loadPostLoading } = useSelector((state) => state.post);

    useEffect(() => {
        // 메인 페이지가 로드되면 요청이 바로 호출됨
        dispatch({
            type: LOAD_POST_REQUEST,
        })
    }, []); // 빈 배열 넣으면 DidMount와 비슷한 효과

    useEffect(() => {
        function onScroll() {
            // 끝까지 내렸는지 확인
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if(hasMorePost && !loadPostLoading) {
                    dispatch({
                        type: LOAD_POST_REQUEST,
                    });
                }
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => { // 이벤트 해제해야함. 아니면 메모리에 계속 쌓여있음?
            window.removeEventListener('scroll', onScroll);
        }
    }, [hasMorePost, loadPostLoading]);

    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLayout>
    );
}

export default Home;