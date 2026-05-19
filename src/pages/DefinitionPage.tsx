import { useParams } from 'react-router-dom';

export default function DefinitionPage() {
  const { id } = useParams();
  return <h2>Страница определения #{id} (будет реализовано позже)</h2>;
}