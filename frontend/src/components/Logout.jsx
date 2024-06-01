function Logout(){
    localStorage.removeItem('employee_login_status')
    localStorage.removeItem('employeeId')

    window.location.href='/employee/login'
    return(
        <></>
    )
}

export default Logout