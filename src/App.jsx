import React, { useState } from 'react';

const StudentItem = ({ student, index, onDelete }) => {
  const { id, name, score, classRoom } = student;

  return (
    <tr>
      <td>{index + 1}</td>
      <td>{name}</td>
      <td>{score}</td>
      <td>{classRoom}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

const StudentTable = ({ students, onDelete }) => {
  return (
    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th>STT</th>
          <th>Họ tên</th>
          <th>Điểm số</th>
          <th>Lớp</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {students.length > 0 ? (
          students.map((student, index) => (
            <StudentItem 
              key={student.id} 
              student={student} 
              index={index} 
              onDelete={onDelete} 
            />
          ))
        ) : (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>Không có sinh viên nào phù hợp</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Nguyễn Văn An', score: 8.5, classRoom: 'IT1' },
    { id: 2, name: 'Trần Thị Bình', score: 4.0, classRoom: 'IT1' },
    { id: 3, name: 'Lê Hoàng Cường', score: 9.2, classRoom: 'IT2' }
  ]);

  const [form, setForm] = useState({ name: '', score: '', classRoom: '' });
  const [filterType, setFilterType] = useState('ALL');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const { name, score, classRoom } = form;

    let validationError = ''; 

    if (!name.trim() || !score || !classRoom.trim()) {
      validationError = `Vui lòng nhập đầy đủ tất cả các trường thông tin!`;
      setError(validationError);
      return;
    }

    let numScore = parseFloat(score); 
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      validationError = `Điểm số "${score}" không hợp lệ (phải từ 0 đến 10)!`;
      setError(validationError);
      return;
    }

    setError('');
    const newStudent = {
      id: Date.now(),
      name,
      score: numScore,
      classRoom
    };

    setStudents([...students, newStudent]);
    setForm({ name: '', score: '', classRoom: '' });
  };

  const handleDeleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter((student) => {
    if (filterType === 'GIOI') return student.score >= 8;
    if (filterType === 'TRUOT') return student.score < 5;
    return true;
  });

  const totalStudents = students.length;
  const averageScore = totalStudents > 0 
    ? (students.reduce((sum, student) => sum + student.score, 0) / totalStudents).toFixed(2) 
    : 0;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Ứng dụng Quản lý Điểm Sinh viên</h2>

      <form onSubmit={handleAddStudent} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
        <h3>Thêm sinh viên mới</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={form.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            step="0.1"
            name="score"
            placeholder="Điểm số"
            value={form.score}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="classRoom"
            placeholder="Lớp"
            value={form.classRoom}
            onChange={handleInputChange}
          />
          <button type="submit">Thêm</button>
        </div>
        {error && <p style={{ color: 'red', margin: '5px 0' }}>{error}</p>}
      </form>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setFilterType('ALL')}>Tất cả</button>
        <button onClick={() => setFilterType('GIOI')}>Giỏi (Điểm ≥ 8)</button>
        <button onClick={() => setFilterType('TRUOT')}>Trượt môn (Điểm &lt; 5)</button>
      </div>

      <div style={{ marginBottom: '15px', background: '#eef2f7', padding: '10px', borderRadius: '5px' }}>
        <p style={{ margin: '5px 0' }}>Tổng số lượng sinh viên: <strong>{totalStudents}</strong></p>
        <p style={{ margin: '5px 0' }}>Điểm trung bình toàn lớp: <strong>{averageScore}</strong></p>
      </div>

      <StudentTable students={filteredStudents} onDelete={handleDeleteStudent} />
    </div>
  );
};

export default App;