import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from "react-query";
import styles from '../../../styles/login/join.module.css';
import InputForm from "../../components/login/LoginComponent";
import Category from "../../components/login/CategoryComponent";

import { myInfoAtom } from "../../../recoil/atoms/userAtom.js"
import {useRecoilState} from "recoil";
import { checkDuplicateEmail } from "../../../services/userApiService.js";
import { getCategory } from "../../../services/commonService.js";
import { join } from "../../../services/userApiService.js";
import { modify } from "../../../services/userApiService.js";

import { useLocation } from 'react-router-dom';

const Join = () => {
    const [myInfo, setMyInfo] = useRecoilState(myInfoAtom);
    const location = useLocation();
    const navigate = useNavigate();

    const [emailValid, setEmailValid] = useState(true);

    const category = useQuery({
        queryKey: 'getCategory',
        queryFn: getCategory,
        onSuccess: (data) => {
            console.log('카테고리 데이터 로딩 성공:', data);
        },
        onError: (error) => {
            console.error('카테고리 데이터 로딩 중 에러 발생:', error);
            alert('카테고리 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    });

    const [input, setInput] = useState({
        email: "",
        password: "",
        presentPassword: "",
        passwordCheck: "",
        nickname: "",
        address: "",
        addressDetail: "",
        category1: "",
        category2: "",
        category3: ""
    });

    const joinAction = useQuery({
        queryKey: "join",
        queryFn: () => join(input),
        enabled: false, // 초기에는 쿼리를 자동 실행하지 않음
        onSuccess: (result) => {
            if(result) {
                alert('회원가입이 완료되었습니다.');
                navigate('/');
            } else {
                alert('이미 사용중인 이메일입니다.');
            }
        },
        onError: (error) => {
            console.error("Error during login:", error);
            alert('회원가입 도중 오류가 발생했습니다.');
        },
    });

    const modifyAction = useQuery({
        queryKey: "modify",
        queryFn: () => modify(input),
        enabled: false, // 초기에는 쿼리를 자동 실행하지 않음
        onSuccess: (result) => {
            console.log(result)
            if (result) {
                alert('수정이 완료되었습니다.');
                navigate('/mypage');
            } else {
                alert('현재 비밀번호가 일치하지 않습니다.');
            }
        },
        onError: (error) => {
            console.error("Error during login:", error);
            alert('회원가입 도중 오류가 발생했습니다.');
        },
    });

    useEffect(() => {
        if (location.pathname === '/editInfo') {
            setInput({
                email: myInfo.userEmail,
                presentPassword: "",
                password: "",
                passwordCheck: "",
                nickname: myInfo.userNickname,
                address: myInfo.userAddress,
                addressDetail: myInfo.userAddressDetail,
                category1: myInfo.userCategory1,
                category2: myInfo.userCategory2,
                category3: myInfo.userCategory3
            });
        } else {
            setInput({
                email: "",
                presentPassword: "",
                password: "",
                passwordCheck: "",
                nickname: "",
                address: "",
                addressDetail: "",
                category1: "",
                category2: "",
                category3: ""
            });
        }
    }, [location, myInfo]);

    const [error, setError] = useState({
        emailError: '',
        presentPasswordError: '',
        passwordError: '',
        passwordCheckError: '',
        nicknameError: '',
        addressError: ''
    });

    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const onClick = () => {
        if (validateForm()) {
            if(location.pathname === '/join') {
                joinAction.refetch();
            } else {
                modifyAction.refetch();
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        const emailRegex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[~?!@#$%^&*_-]).{8,}$/;

        if (!input.email) {
            errors.emailError = '이메일을 입력하세요.';
        } else if (!emailRegex.test(input.email)) {
            errors.emailError = '이메일 형식이 맞지 않습니다.';
        }

        if(!emailValid) {
            errors.emailError = '사용중인 이메일입니다.';
        }

        if (location.pathname === "/editInfo") {
            if (input.presentPassword) {
                errors.presentPasswordError = '현재 비밀번호를 입력해주세요.';
            }
        }

        if (location.pathname === "/join") {
            if (!input.password) {
                errors.passwordError = '비밀번호를 입력하세요.';
            } else if (!passwordRegex.test(input.password)) {
                errors.passwordError = '비밀번호는 8자 이상, 영어 대/소문자, 특수문자가 포함되어야합니다.';
            }
        } else {
            // 새 비밀번호가 빈값일 때 비밀번호는 set 하지 않기
            if (input.password && !passwordRegex.test(input.password)) {
                errors.passwordError = '비밀번호는 8자 이상, 영어 대/소문자, 특수문자가 포함되어야합니다.';
            }
        }

        if (location.pathname === "/join") {
            if (!input.passwordCheck) {
                errors.passwordCheckError = '비밀번호를 다시 한번 적어주세요.';
            } else if (input.passwordCheck !== input.password) {
                errors.passwordCheckError = '비밀번호가 동일하지 않습니다.';
            }
        } else {
            if (input.passwordCheck !== input.password) {
                errors.passwordCheckError = '비밀번호가 동일하지 않습니다.';
            }
        }

        if (!input.nickname) {
            errors.nicknameError = '닉네임을 입력하세요.';
        } else if (input.nickname.length > 10) {
            errors.nicknameError = '닉네임은 10자 이하여야합니다.';
        }

        if (!input.address) {
            errors.addressError = '주소를 선택하세요.';
        }

        if (input.address && !input.addressDetail) {
            errors.addressError = '상세주소를 입력하세요.';
        }

        setError(errors);

        return Object.keys(errors).length === 0;
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const openPostcodePopup = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 팝업 창에서 주소를 선택한 후 메인 화면에 값 적용
                setInput((prevState) => ({
                    ...prevState,
                    address: data.address, // 선택된 도로명 주소
                }));
            }
        }).open();
    };

    return (
        <div className={styles['join']}>
            <div className={styles['join-container']}>
                <div className={styles['signup-form']}>
                    <h2>{location.pathname === "/join" ? "이메일로 회원가입" : "회원정보 수정"}</h2>
                    <form>
                        <div className={styles['form-group']}>
                            <InputForm
                                type={'email'}
                                input={input}
                                onChange={onChange}
                                className={error.emailError ? styles['error-border'] : ''}
                                disabled={location.pathname === "/editInfo" && true}
                            />
                            {error.emailError && <span className={styles['error-message']}>{error.emailError}</span>}
                        </div>
                        {location.pathname === "/editInfo" && (
                            <div className={styles['form-group']}>
                                <InputForm
                                    type={'presentPassword'}
                                    input={input}
                                    onChange={onChange}
                                    className={error.presentPasswordError ? styles['error-border'] : ''}
                                />
                                {error.presentPasswordError &&
                                    <span className={styles['error-message']}>{error.presentPasswordError}</span>}
                            </div>
                        )}
                        <div className={styles['form-group']}>
                            <InputForm
                                type={location.pathname === "/join" ? 'password' : 'newPassword'}
                                input={input}
                                onChange={onChange}
                                className={error.passwordError ? styles['error-border'] : ''}
                            />
                            {error.passwordError &&
                                <span className={styles['error-message']}>{error.passwordError}</span>}
                        </div>
                        <div className={styles['form-group']}>
                            <InputForm
                                type={'passwordCheck'}
                                input={input}
                                onChange={onChange}
                                className={error.passwordCheckError ? styles['error-border'] : ''}
                            />
                            {error.passwordCheckError && <span className={styles['error-message']}>{error.passwordCheckError}</span>}
                        </div>
                        <div className={styles['form-group']}>
                            <InputForm
                                type={'nickname'}
                                input={input}
                                onChange={onChange}
                                className={error.nicknameError ? styles['error-border'] : ''}
                            />
                            {error.nicknameError && <span className={styles['error-message']}>{error.nicknameError}</span>}
                        </div>
                        <div className={styles['form-group']}>
                            <label>주소</label>
                            <div className={styles['address-container']}>
                                <input
                                    type="text"
                                    name='address'
                                    placeholder="주소를 찾아주세요"
                                    value={input.address}
                                    className={error.addressError ? styles['error-border'] : ''}
                                    readOnly
                                />
                                <button
                                    type='button'
                                    className={styles['find-address']}
                                    onClick={openPostcodePopup} // 팝업 열기
                                >
                                    찾기
                                </button>
                            </div>
                            <input
                                type="text"
                                name='addressDetail'
                                placeholder="상세주소 입력"
                                onChange={onChange}
                                value={input.addressDetail}
                                className={error.addressError ? styles['error-border'] : ''}
                            />
                            {error.addressError && <span className={styles['error-message']}>{error.addressError}</span>}
                        </div>

                        <div className={styles['form-group']}>
                            <label>관심 카테고리</label>
                            {category.data && (
                                <>      
                                    <Category
                                        onChange={onChange}
                                        input={input.category1}
                                        name={'category1'}
                                        categoryData={category.data}
                                    />
                                    <Category
                                        onChange={onChange}
                                        input={input.category2}
                                        name={'category2'}
                                        categoryData={category.data}
                                    />
                                    <Category
                                        onChange={onChange}
                                        input={input.category3}
                                        name={'category3'}
                                        categoryData={category.data}
                                    />
                                </>
                            )}
                        </div>
                        <button type="button" onClick={onClick} className={styles['submit-button']}>{location.pathname === "/join" ? "제출하기" : "수정하기"}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default Join;
