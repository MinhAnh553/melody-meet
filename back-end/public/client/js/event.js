// Lấy data địa chỉ
$(document).ready(function () {
    $.getJSON('/client/provinces.json', function (data) {
        let provinceSelect = $('#province');
        let districtSelect = $('#district');
        let wardSelect = $('#ward');

        provinceSelect
            .empty()
            .append('<option value="">Chọn tỉnh/thành</option>');
        $.each(data, function (index, province) {
            provinceSelect.append(
                `<option value="${province.name}" data-code="${province.code}">
                    ${province.name}
                </option>`,
            );
        });

        provinceSelect.change(function () {
            districtSelect
                .empty()
                .append('<option value="">Chọn quận/huyện</option>');
            wardSelect
                .empty()
                .append('<option value="">Chọn phường/xã</option>');

            let provinceCode = $(this).find('option:selected').data('code');
            if (provinceCode) {
                let selectedProvince = data.find((p) => p.code == provinceCode);
                $.each(selectedProvince.districts, function (index, district) {
                    districtSelect.append(
                        `<option value="${district.name}" data-code="${district.code}">
                            ${district.name}
                        </option>`,
                    );
                });
            }
        });

        districtSelect.change(function () {
            wardSelect
                .empty()
                .append('<option value="">Chọn phường/xã</option>');

            let districtCode = $(this).find('option:selected').data('code');
            let selectedProvince = data.find(
                (p) =>
                    p.code ==
                    provinceSelect.find('option:selected').data('code'),
            );
            if (selectedProvince) {
                let selectedDistrict = selectedProvince.districts.find(
                    (d) => d.code == districtCode,
                );
                $.each(selectedDistrict.wards, function (index, ward) {
                    wardSelect.append(
                        `<option value="${ward.name}" data-code="${ward.code}">
                            ${ward.name}
                        </option>`,
                    );
                });
            }
        });
    });
});

// Úp Ảnh
function setupUploadBox(
    uploadBoxId,
    fileInputId,
    previewImgId,
    iconId,
    textId,
) {
    let uploadBox = document.getElementById(uploadBoxId);
    let fileInput = document.getElementById(fileInputId);
    let previewImg = document.getElementById(previewImgId);
    let icon = document.getElementById(iconId);
    let text = document.getElementById(textId);

    if (uploadBox && fileInput && previewImg && icon && text) {
        uploadBox.addEventListener('click', function () {
            fileInput.click();
        });

        fileInput.addEventListener('change', function (event) {
            let file = event.target.files[0];
            if (file) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block'; // Hiển thị ảnh xem trước
                    icon.style.display = 'none'; // Ẩn icon upload
                    text.style.display = 'none'; // Ẩn chữ "Thêm logo ban tổ chức"
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Gọi hàm cho từng phần tử
setupUploadBox(
    'uploadOrganizer',
    'organizerInput',
    'previewOrganizer',
    'iconOrganizer',
    'textOrganizer',
);
setupUploadBox(
    'uploadLogo',
    'logoInput',
    'previewLogo',
    'iconLogo',
    'textLogo',
);
setupUploadBox(
    'uploadBackground',
    'backgroundInput',
    'previewBackground',
    'iconBackground',
    'textBackground',
);

// Submit step 1
document.addEventListener('DOMContentLoaded', function () {
    const btnSubmitStep1 = document.getElementById('submitEvent');

    if (btnSubmitStep1) {
        btnSubmitStep1.addEventListener('click', async () => {
            const eventForm = document.getElementById('eventForm');
            if (!eventForm) return;

            // Kiểm tra hình ảnh
            const eventLogoInput = document.querySelector(
                'input[name="eventLogo"]',
            );
            const eventBackgroundInput = document.querySelector(
                'input[name="eventBackground"]',
            );
            const organizerLogoInput = document.querySelector(
                'input[name="organizerLogo"]',
            );

            const fileInputs = [
                { input: eventLogoInput, name: 'logo sự kiện' },
                { input: eventBackgroundInput, name: 'nền sự kiện' },
                { input: organizerLogoInput, name: 'logo ban tổ chức' },
            ];

            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            for (let fileInput of fileInputs) {
                if (!fileInput.input || fileInput.input.files.length === 0) {
                    Swal.fire(
                        'Lỗi!',
                        `Vui lòng chọn ảnh cho ${fileInput.name}.`,
                        'error',
                    );
                    return;
                }

                const file = fileInput.input.files[0];

                if (!validImageTypes.includes(file.type)) {
                    Swal.fire(
                        'Lỗi!',
                        `Ảnh ${fileInput.name} phải có định dạng JPG, PNG, JPG.`,
                        'error',
                    );
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    Swal.fire(
                        'Lỗi!',
                        `Ảnh ${fileInput.name} phải nhỏ hơn 5MB.`,
                        'error',
                    );
                    return;
                }
            }

            // Kiểm tra dữ liệu nhập
            let isValid = true;
            let firstErrorField = null;
            let requiredFields = eventForm.querySelectorAll(
                'input, select, textarea',
            );

            requiredFields.forEach((field) => {
                if (field.hasAttribute('name') && field.value.trim() === '') {
                    isValid = false;
                    field.classList.add('is-invalid');

                    if (!firstErrorField) {
                        firstErrorField = field;
                    }
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                Swal.fire('Lỗi!', 'Vui lòng điền đầy đủ thông tin!', 'error');
                if (firstErrorField) {
                    firstErrorField.focus();
                }
                return;
            }

            // Nếu tất cả hợp lệ, gửi form
            const formData = new FormData(eventForm);

            try {
                const response = await fetch('/event/create', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (result.error) {
                    Swal.fire('Lỗi!', result.error, 'error');
                } else {
                    Swal.fire({
                        title: 'Thành công!',
                        text: result.message,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        location.reload(); // Làm mới trang sau khi tạo sự kiện thành công
                    });
                }
            } catch (error) {
                Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi gửi dữ liệu.', 'error');
                console.error(error);
            }
        });
    }
});
