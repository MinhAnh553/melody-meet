const otpTemplate = (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; background-color: #f9f9f9;">
        <h2 style="color: #007bff;">🔐 Mã Xác Minh</h2>
        <p style="font-size: 16px; color: #333;">Chào bạn,</p>
        <p style="font-size: 16px; color: #333;">Dưới đây là mã xác minh của bạn:</p>
        <div style="font-size: 24px; font-weight: bold; color: #d9534f; background: #f8d7da; padding: 10px; border-radius: 5px; display: inline-block;">
            ${otp}
        </div>
        <p style="font-size: 14px; color: #555; margin-top: 20px;">
            Mã này sẽ hết hạn sau <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777;">Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.</p>
    </div>
`;

export default otpTemplate;
