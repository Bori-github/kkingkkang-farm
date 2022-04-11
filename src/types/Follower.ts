export interface Follower {
  _id: string;
  username: string;
  accountname: string;
  intro: string;
  image: string;
  isfollow: boolean;
  following: [];
  follower: ['접속한 사용자의 id'];
  followerCount: number;
  followingCount: number;
}
