import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import MultipleChoiceLayout from '../../../../layouts/MultipleChoiceLayout';
import AdminProblemAPI from '../../../../apis/admin/problem';
import './style.scss';
import problemsBank from '../../../../apis/problemsBank';
import Loading from '../../../../components/Loading/Loading';
import ProblemComponent from '../../components/ProblemComponent';
import WrapperLoading from '../../../../components/WrapperLoading';
import ProblemDisplayTable from '../../components/ProblemDisplayTable';
import Search from '../../../../components/Search';

function MultipleChoicePage(props) {
	const [problems, setProblems] = useState([]);
	const [resultProblems, setResultProblems] = useState([]);
	const [countDisplayProblem, setCountDisplayProblem] = useState(15);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const fetchData = async () => {
				const res = await problemsBank.getMultiProblems();
				setProblems(res.data);
				const sliceProblems = res.data.slice(0, Number(countDisplayProblem));
				setResultProblems(sliceProblems);
				setLoading(false);
			};
			fetchData();
		} catch (error) {
			console.log('서버 연결 실패합니다. 다시 시도해주세요.');
		}
	}, []);
	const handleChangeDisplayPro = (e) => {
		setLoading(true);
		const countValue = e.target.value;
		setCountDisplayProblem(Number(countValue));

		const sliceProblems = problems.slice(0, Number(countValue));
		setResultProblems(sliceProblems);
		setTimeout(function() {
			setLoading(false);
		}, 500);
	};
	const blockFotter = problems.length === 0 ? {display: 'none'} : {display: 'block'};

	const handleSetResultProblem = (data) => {
		setLoading(true);
		const sliceProblems = data.slice(0, Number(countDisplayProblem));

		setResultProblems(sliceProblems);
		setTimeout(function() {
			setLoading(false);
		}, 500);
	};
	const handlePrevProblem = () => {
		let prevPage= currentPage - 1;
		const sliceProblems = problems.slice(prevPage * countDisplayProblem, currentPage * countDisplayProblem);
		setCurrentPage(prevPage);
		setResultProblems(sliceProblems);
	};
	const handleNextProblem = () =>{
		let nextPage= currentPage + 1;
		const sliceProblems = problems.slice(nextPage * countDisplayProblem, (nextPage * countDisplayProblem) + countDisplayProblem);
		setCurrentPage(nextPage);
		setResultProblems(sliceProblems);
	};

	const handleNumberPage = (idx) => {
		const sliceProblems = problems.slice(idx * countDisplayProblem, (idx * countDisplayProblem) + countDisplayProblem);
		setResultProblems(sliceProblems);
		setCurrentPage(idx);
	};
	const [currentPage, setCurrentPage] = useState(0);

	// !check
	const calCountPage = () => {
		let totalPage = problems.length / countDisplayProblem;
		let result = new Array();
		for (let i = 0; i < totalPage; i++) {
			result.push(<span onClick={() => handleNumberPage(i)} style={currentPage === i ? {fontSize: '20px'} : {}}> {i + 1} </span>);
		}
		return result;
	};
	return (
		<MultipleChoiceLayout>
			{
				<section className="multiple-choice">
					<div className="multiple-choice__search">
						<Search
							problems={ problems }
							setResultProblem={(data) => handleSetResultProblem(data)}
						/>
					</div>
					<div className="wrapper__multiple-choice">
						{
							loading ? <WrapperLoading type={'bars'} color={'black'} /> :
								resultProblems.length !== 0 &&
                                <ProblemDisplayTable
                                	problems = {resultProblems}
                                	problemType = {'객관식문제'}
                                />
						}
						{
							!loading &&
                        <div className="row-selector" style={blockFotter}>
                        	<select className="form-control" onChange={handleChangeDisplayPro} value={countDisplayProblem}>
                        		<option value="15">15</option>
                        		<option value="30" selected="">30</option>
                        		<option value="50">50</option>
                        		<option value="100">100</option>
                        	</select>
                        	<span className="sort-caret">
                                문제수
                        	</span>
                        	<div>
                        		<button onClick={() => handlePrevProblem()} disabled={currentPage === 0}> {'<<'} </button>
                        		{
                        			calCountPage()
                        		}
                        		<button onClick={() => handleNextProblem()} disabled={(problems.length / countDisplayProblem) !== 1 ? currentPage >= ((problems.length / countDisplayProblem) - 1) : true}> {'>>'} </button>
                        	</div>
                        </div>
						}
					</div>
				</section>
			}
		</MultipleChoiceLayout>
	);
}

export default MultipleChoicePage;

