import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

import logo from '../../assets/logo.svg';
import { Container, Content, SideImage } from './styles';
import Input from '../../components/Input/index';
import Button from '../../components/Button/index';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail é obrigatório')
            .email('Insira uma e-mail válido'),
          password: Yup.string().min(6, 'Senha requer pelo menos 6 digitos'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro efetuado com sucesso',
          description: 'Você já pode realizar seu login',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro no cadastro',
            description:
              'Ocorreu um erro ao tentar realizar o cadastro, tente novamente',
          });
        }
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <SideImage />
      <Content>
        <img src={logo} alt="GoBaber logo" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Nome" />

          <Input name="email" icon={FiMail} type="email" placeholder="E-mail" />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit"> Cadastrar </Button>
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para Login
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;
