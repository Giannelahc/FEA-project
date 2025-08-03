import { Input, Button, Flex } from 'antd';

function RegisterForm() {
    return (
        <form style={{ maxWidth: 400, margin: '0 auto' }}>
            <h3>Register</h3>
            <Input placeholder="Username" required style={{ marginBottom: '16px' }} />

            <Input placeholder="Email" required style={{ marginBottom: '16px' }} />

            <Input.Password placeholder="password" required />

            <Flex justify="center" style={{ marginTop: '20px' }}>
                <Button type="primary">Register</Button>
            </Flex>
        </form>
    );
}
export default RegisterForm;
