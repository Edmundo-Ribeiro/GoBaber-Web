import React, { useRef, useCallback } from 'react';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';

import { Container, Content, SideImage } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();
  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha é obrigatória'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        const token = location.search.replace('?token=', '');
        const { password, password_confirmation } = data;

        console.log(token);
        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro ao resetar sua senha',
            description:
              'Ocorrecu um erro ao  tentar resetar sua senha,tente novamente',
          });
        }
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBaber logo" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Resetar Senha</h1>

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirme a Senha"
          />

          <Button type="submit"> Alterar Senha </Button>
        </Form>

        <Link to="/">
          <FiLogIn />
          Voltar para login
        </Link>
      </Content>

      <SideImage />
    </Container>
  );
};

export default ResetPassword;
