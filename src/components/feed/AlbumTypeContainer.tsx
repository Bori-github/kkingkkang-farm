import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { API_ENDPOINT } from '../../constants';
import { PostData } from '../../types';
import { fetcher } from '../../utils';
import { Loader } from '../common/Loader';

const PAGE_SIZE = 10;

export const AlbumTypeContainer = () => {
  const accountname = Cookies.get('accountname');

  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: myFeedData,
    error,
    setSize,
  } = useSWRInfinite(
    (index) =>
      `${API_ENDPOINT}/post/${accountname}/userpost/?limit=${PAGE_SIZE}&skip=${
        index * PAGE_SIZE
      }`,
    fetcher,
    { revalidateAll: true },
  );

  const isEmpty = myFeedData?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty ||
    (myFeedData && myFeedData[myFeedData.length - 1]?.post.length < PAGE_SIZE);

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && !isReachingEnd) {
      setIsLoading(false);
      setSize((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.6,
    });
    observer.observe(target);
    // eslint-disable-next-line consistent-return
    return () => observer && observer.disconnect();
  }, [target]);

  if (!myFeedData) return <Loader height="calc(100vh - 109px)" />;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <PostList>
      {myFeedData.map((data) => {
        return data.post.map((postData: PostData) => {
          const { id: postId, image } = postData;
          const imageList = image.split(',');

          return (
            imageList[0].length > 0 && (
              <li key={`post-item-${postId}`}>
                <Link href={`/post/${postId}`}>
                  <a href="replace">
                    <Image src={imageList[0]} alt="" />
                  </a>
                </Link>
              </li>
            )
          );
        });
      })}
    </PostList>
  );
};

const PostList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 8px;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;
