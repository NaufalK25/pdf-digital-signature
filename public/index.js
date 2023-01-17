const filesFormGroup = document.querySelector('.files_form_group');
const fileInput = filesFormGroup.querySelector('input[type="file"]');
const textInput = filesFormGroup.querySelector('textarea');

fileInput.addEventListener('change', e => {
    const filenames = [];

    for (const file of e.target.files) {
        filenames.push(file.name);
    }

    textInput.value = filenames.join('\n');
    textInput.title = filenames.join('\n');
});
