import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado!',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),

          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Insira uma e-mail válido'),

          password: Yup.string(),

          passwordConfirmation: Yup.string()
            .when('password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo Obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),

          oldPassword: Yup.string().when('password', {
            is: val => !!val.length,
            then: Yup.string().required('Informe a senha atual'),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });

        const formData = {
          name: data.name,
          email: data.email,
          ...(data.password
            ? {
                oldPassword: data.oldPassword,
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
              }
            : {}),
        };

        if (
          user.name !== formData.name ||
          user.email !== formData.email ||
          data.password
        ) {
          const response = await api.put('/profile', formData);
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Autalização de cadastro efetuado com sucesso',
          });
        }
        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro nos dados fornecidos',
            description:
              'Ocorreu um erro ao tentar realizar a atualização dos seus dados, tente novamente',
          });
        }
      }
    },
    [addToast, history, updateUser, user.email, user.name],
  );

  return (
    <Container>
      <header>
        <Link to="/dashboard">
          <FiArrowLeft />
        </Link>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            {user.avatar_url && <img src={user.avatar_url} alt={user.name} />}
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu Perfil</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />

          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />

          <Input
            name="passwordConfirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirme sua senha"
          />

          <Input
            name="oldPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />

          <Button type="submit"> Confirmar Mudanças </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
