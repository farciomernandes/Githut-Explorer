import React, {useState, useEffect, FormEvent} from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repositories, Error } from './styles';
import api  from "../../services/api";

import logo from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  owner: {
    login: string;
    avatar_url:string;
  };
  description:string;
}

const Dashboard: React.FC = ( )=> {
  const [newRepo, setNewrepo] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>(()=>{
    const storagedRepositories = localStorage.getItem('@GitHubExplorer:repositories');
    if( storagedRepositories ){
      return JSON.parse(storagedRepositories);
    }else {
      return [];
    }
  });

  const [inputError, setInputError] = useState('');



  useEffect(()=>{
    localStorage.setItem('@GitHubExplorer:repositories', JSON.stringify(repositories));
  },[repositories])

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
    event.preventDefault();

    if(!newRepo){
      setInputError('Digite o autor/nome do repositório.');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

    setRepositories([...repositories,  repository]);
    setInputError('');
    }catch(err){
      setInputError('Erro na busca por esse repositório.')
    }

    setNewrepo('')
  }

  return (
    <>
      <img src={logo} alt="Githut Explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form hashError={ !!inputError } onSubmit={handleAddRepository}>
        <input placeholder="Digite o nome do repositório"  value={newRepo}
        onChange={text => setNewrepo(text.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

    { inputError && <Error>{inputError}</Error> }

      <Repositories>
      {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
            <img src={repository.owner. avatar_url}
             alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={25} />
        </Link>
      ))}
      </Repositories>

      </>
  )
}

export default Dashboard;
