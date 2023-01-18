// get files name from browser and display them in textarea
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

// show loading spinner when form is submitted
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', e => {
        const button = form.querySelector('button');
        const spinner = button.querySelector('.loading.hidden');
        const text = button.querySelector('span');

        spinner.classList.remove('hidden');
        text.classList.add('hidden');
    });
});
