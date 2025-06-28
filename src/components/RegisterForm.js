function RegisterForm() {
    return (
        <form>
            <h3>Register</h3>
            <input type="text" placeholder="Username" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
}
export default RegisterForm;
  