import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';

import { Container, Content, SideImage } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Insira uma e-mail válido'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um email de recuperação de senha, cheque sua caixa de entrada',
        });

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro na recuperação de senha',
            description:
              'Ocorrecu um erro ao tentar recuperar a senha, tente novamente',
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBaber logo" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Recuperação de Senha</h1>

          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <Button loading={loading} type="submit">
            Recuperar
          </Button>
        </Form>

        <Link to="/">
          <FiLogIn />
          Voltar ao login
        </Link>
      </Content>

      <SideImage />
    </Container>
  );
};

export default ForgotPassword;
