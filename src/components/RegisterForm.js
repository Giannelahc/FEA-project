import { Input, Button, Flex } from 'antd';

function RegisterForm() {
    return (
        <form>
            <h3>Register</h3>
            <Input placeholder="Username" required />

            <Input placeholder="Email" required />

            <Input.Password placeholder="password" required />

            <Flex justify="center" style={{ marginTop: '20px' }}>
                <Button type="primary">Register</Button>
            </Flex>
        </form>
    );
}
export default RegisterForm;
