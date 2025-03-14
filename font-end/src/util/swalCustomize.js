import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showCloseButton: true,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    // didOpen: (toast) => {
    //     toast.onmouseenter = Swal.stopTimer;
    //     toast.onmouseleave = Swal.resumeTimer;
    // },
});

export default {
    Toast,
};
