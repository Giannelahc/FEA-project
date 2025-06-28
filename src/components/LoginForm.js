function LoginForm() {
    return (
        <form>
            <h3>Login</h3>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
}
export default LoginForm;