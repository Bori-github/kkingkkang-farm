import styled from '@emotion/styled';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import {
  API_ENDPOINT,
  BORDER,
  BUTTON,
  USER_AVATAR,
  Z_INDEX,
} from '../constants';
import { WHITE } from '../constants/colors';
import { fetcher } from '../utils';
import { BtnImgUpload } from './BtnImgUpload';
import { Loader } from './common/Loader';
import { UserAvatar } from './UserAvatar';

interface PostProps {
  postData: {
    id: string;
  };
}

export const SectionInpReply = ({ postData }: PostProps) => {
  const { id: postID } = postData;
  const accountname = Cookies.get('accountname');
  const token = Cookies.get('token');
  const router = useRouter();
  const { data, error } = useSWR(
    `${API_ENDPOINT}/profile/${accountname}`,
    fetcher,
  );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm({ mode: 'onChange' });

  const handleTextarea = (e: FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    const { scrollHeight } = e.currentTarget;
    e.currentTarget.style.height = `${scrollHeight - 10}px`;
  };

  const handleComment = handleSubmit(async () => {
    const { comment } = getValues();

    await axios(`${API_ENDPOINT}/post/${postID}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      data: JSON.stringify({
        comment: {
          content: comment,
        },
      }),
    });
    router.push(`/post/${postID}`);
  });

  if (!data) return <Loader height="calc(100vh - 109px)" />;
  if (error) return <div>에러가 발생했습니다.</div>;

  return (
    <Contaioner>
      <h3 className="sr-only">댓글 입력</h3>
      <UserAvatar size={USER_AVATAR.sm.size} src={data.profile.image} />
      <Form onSubmit={handleComment}>
        <TextArea
          rows={1}
          placeholder={`${data.profile.username}(으)로 댓글 달기...`}
          onInput={handleTextarea}
          {...register('comment', {
            required: true,
          })}
        />
        <BtnSend type="submit" disabled={!isValid}>
          게시
        </BtnSend>
      </Form>
    </Contaioner>
  );
};

export const SectionInpChat = () => {
  return (
    <Contaioner>
      <h3 className="sr-only">채팅 입력</h3>
      <BtnImgUpload />
      <Form>
        <InpTxt type="text" placeholder="메시지 입력하기" />
        <BtnSend type="button" className="active">
          전송
        </BtnSend>
      </Form>
    </Contaioner>
  );
};

const Contaioner = styled.article`
  display: grid;
  grid-template-columns: 42px auto;
  gap: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${Z_INDEX.header};
  padding: 5px;
  border-top: ${BORDER.basic};
  background-color: ${WHITE};
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: auto 50px;
  gap: 10px;
  align-items: center;
`;

const InpTxt = styled.input`
  padding: 5px 0;
  border: 0;
  background: none;
`;

const TextArea = styled.textarea`
  padding: 5px 0;
  border: 0;
  resize: none;
`;

const BtnSend = styled.button`
  padding: 5px;
  border-radius: 26px;
  background-color: ${BUTTON.background_color};
  color: ${WHITE};

  &:disabled {
    background-color: ${BUTTON.disabled_color};
  }
`;
