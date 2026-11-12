import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions, loading, error }) => {
  const [filter, setFilter] = useState('all'); // all | official | reserve
  const [sort, setSort] = useState('id'); // id | asc | desc
  const [search, setSearch] = useState('');

  if (loading) return <h2>Đang tải câu hỏi...</h2>;
  if (error) return <h2>Không tải được câu hỏi</h2>;

  const counts = {
    all: questions.length,
    official: questions.filter((q) => !q.reserve).length,
    reserve: questions.filter((q) => q.reserve).length,
  };

  const keyword = search.trim().toLowerCase();
  let list = questions
    .filter((q) => filter === 'all' || (filter === 'official' ? !q.reserve : q.reserve))
    .filter((q) => q.question.toLowerCase().includes(keyword));

  list = [...list].sort((a, b) => {
    if (sort === 'asc') return a.level - b.level || a.id - b.id;
    if (sort === 'desc') return b.level - a.level || a.id - b.id;
    return a.id - b.id;
  });

  const filterButton = (key, label) => (
    <button
      onClick={() => setFilter(key)}
      style={{
        background: filter === key ? '#ff7a00' : '#fff',
        color: filter === key ? '#fff' : '#222',
      }}
    >
      {`${label} (${counts[key]})`}
    </button>
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="toolbar">
        {filterButton('all', 'Tất cả')}
        {filterButton('official', 'Chính thức')}
        {filterButton('reserve', 'Dự bị')}
      </div>
      <div className="toolbar">
        <label>
          Sắp xếp:{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="id">Theo số thứ tự</option>
            <option value="asc">Mức độ: Dễ → Khó</option>
            <option value="desc">Mức độ: Khó → Dễ</option>
          </select>
        </label>
        <label>
          Tìm kiếm:{' '}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <p>{`Có ${list.length} câu hỏi`}</p>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Loại</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>
        <tbody>
          {list.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{LEVELS[q.level]}</td>
              <td>{q.reserve ? 'Dự bị' : 'Chính thức'}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
