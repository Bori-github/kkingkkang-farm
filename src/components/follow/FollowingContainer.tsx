import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { API_ENDPOINT } from '../../constants';
import { Following } from '../../types/Following';
import { fetcher } from '../../utils';
import { FollowingCard } from './FollowingCard';

export const FollowingContainer = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(
    `${API_ENDPOINT}/profile/${id}/following`,
    fetcher,
  );

  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    if (data) {
      setFollowingList(data);
    }
  }, [data]);

  if (!data) return <div>잠시만 기다려주세요.</div>;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <ListFollowing>
      {followingList.map((followingData: Following) => {
        const { _id, accountname, image, isfollow, username } = followingData;
        return (
          <FollowingCard
            key={`following-list-${_id}`}
            followingData={{
              accountname,
              image,
              isfollow,
              username,
            }}
          />
        );
      })}
    </ListFollowing>
  );
};

const ListFollowing = styled.ul`
  display: grid;
  gap: 15px;
  padding: 20px 0;
`;
