// Đăng ký tài khoản
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('passwordStrengthIndicator');
const strengthText = document.getElementById('passwordStrengthText');

passwordInput.addEventListener('input', function () {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    updateStrengthIndicator(strength);
});

// Kiểm tra độ mạnh mật khẩu
const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++; // Độ dài ít nhất 8 ký tự
    if (/[a-z]/.test(password)) strength++; // Chứa chữ thường
    if (/[A-Z]/.test(password)) strength++; // Chứa chữ in hoa
    if (/\d/.test(password)) strength++; // Chứa số
    if (/[@$!%*?&]/.test(password)) strength++; // Chứa ký tự đặc biệt

    return strength;
};

// Cập nhật thanh đo độ mạnh
const updateStrengthIndicator = (strength) => {
    let percentage = strength * 20;
    let color = '';
    let text = '';

    switch (strength) {
        case 0:
        case 1:
            color = 'bg-danger'; // Đỏ (rất yếu)
            text = 'Rất yếu';
            break;
        case 2:
            color = 'bg-warning'; // Cam (yếu)
            text = 'Yếu';
            break;
        case 3:
            color = 'bg-info'; // Xanh nhạt (trung bình)
            text = 'Trung bình (Hợp lệ ✅)';
            break;
        case 4:
            color = 'bg-primary'; // Xanh dương (mạnh)
            text = 'Mạnh (Hợp lệ ✅)';
            break;
        case 5:
            color = 'bg-success'; // Xanh lá (rất mạnh)
            text = 'Rất mạnh (Hợp lệ ✅)';
            break;
    }

    strengthBar.style.width = percentage + '%';
    strengthBar.className = `progress-bar ${color}`;
    strengthText.textContent = text;

    if (strength < 3) {
        strengthText.style.color = 'red';
    } else {
        strengthText.style.color = 'green';
    }
};

document
    .getElementById('registerForm')
    .addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword =
            document.getElementById('confirmPassword').value;

        const strength = checkPasswordStrength(password);

        if (strength < 3) {
            return Swal.fire({
                icon: 'error',
                title: 'Mật khẩu không hợp lệ!',
                text: 'Mật khẩu quá yếu! Vui lòng nhập mật khẩu mạnh hơn.',
                confirmButtonText: 'OK',
            });
        }

        if (password !== confirmPassword) {
            return Swal.fire({
                icon: 'error',
                title: 'Mật khẩu không khớp!',
                text: 'Vui lòng nhập lại mật khẩu.',
                confirmButtonText: 'OK',
            });
        }

        const res = await fetch('/user/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
            Swal.fire({ icon: 'success', text: data.message });
            document.querySelector(
                '.my-email',
            ).textContent = `Chúng tôi đã gửi mã xác minh đến email ${email}`;
            document.getElementById('registrationStep').style.display = 'none';
            document.getElementById('verificationStep').style.display = 'block';
        } else {
            Swal.fire({ icon: 'error', text: data.message });
        }
    });

document
    .getElementById('verificationForm')
    .addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const otp = Array.from(document.querySelectorAll('.verification-input'))
            .map((input) => input.value)
            .join('');
        const password = document.getElementById('password').value;
        const res = await fetch('/user/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password }),
        });

        const data = await res.json();
        if (res.ok) {
            Swal.fire({ icon: 'success', text: data.message }).then(() => {
                window.location.href = '/';
            });
        } else {
            Swal.fire({ icon: 'error', text: data.message });
        }
    });

document
    .getElementById('backToRegister')
    .addEventListener('click', function () {
        document.getElementById('verificationStep').style.display = 'none';
        document.getElementById('registrationStep').style.display = 'block';
    });

const verificationInputs = document.querySelectorAll('.verification-input');
verificationInputs.forEach((input, index) => {
    input.addEventListener('input', function () {
        if (this.value && index < verificationInputs.length - 1) {
            verificationInputs[index + 1].focus();
        }
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !this.value && index > 0) {
            verificationInputs[index - 1].focus();
        }
    });
});

// Đăng nhập
document
    .getElementById('loginForm')
    .addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;

        const res = await fetch('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await res.json();
        if (result.success) {
            Swal.fire('Thành công!', result.message, 'success').then(() => {
                window.location.href = '/';
            });
        } else {
            Swal.fire('Thất bại!', result.message, 'error');
        }
    });

// Đăng xuất
const buttonLogout = document.querySelector('.action-logout');
if (buttonLogout) {
    buttonLogout.addEventListener('click', async function (e) {
        window.location.href = '/user/logout';
    });
}
