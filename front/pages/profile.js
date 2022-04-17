import AppLayout from "../components/AppLayout"
import NicknameEditForm from "../components/NicknameEditForm"
import FollowList from "../components/FollowList"
import Head from 'next/head';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Router from 'next/router';

const Profile = () => {
    const { me } = useSelector((state) => state.user);

    useEffect(() => {
        if(!(me && me.id)) {
            Router.push('/'); // redirect
        }
    }, [me && me.id]);
    
    if(!me) {   // 로그인하지않으면 프로필 접근X
        return null;
    }
    return (
        <>
            <Head>
                <title>내 프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <FollowList header="팔로잉" data={me.Followings}/>
                <FollowList header="팔로워" data={me.Followers}/>
            </AppLayout>
        </>
    );
};

export default Profile;