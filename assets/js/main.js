
/*
List of colors:
    - Black
    - Red
    - Green
    - Yellow
    - Blue
    - Magenta
    - Cyan
    - White
    - Pink
    - Orange
    - Purple
    - Gold
    - Silver
    - Gray
    - Brown
    - Maroon
    - Lime
    
    - Glow White
    - Glow Red
    - Glow Green
    - Glow Blue
    - Glow Magenta
    - Glow Cyan
    - Glow Yellow
    - Glow Gold
*/

const colors_container = document.querySelector('.colors');
const selected_color_element = document.querySelector('.selected-color');

const colors = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'pink',
    'orange',
    'purple',
    'gold',
    'silver',
    'gray',
    'brown',
    'maroon',
    'lime',

    'glow-white',
    'glow-red',
    'glow-green',
    'glow-blue',
    'glow-magenta',
    'glow-cyan',
    'glow-yellow',
    'glow-gold'
];

let selected_color = 'black';

colors.forEach(color => {
    const color_element = document.createElement('div');
    color_element.classList.add('color');
    color_element.classList.add('a-' + color);
    color_element.innerHTML = 'X';
    colors_container.appendChild(color_element);

    color_element.addEventListener('click', () => {
        selected_color_element.style.backgroundColor = color;
        selected_color = color;
    });
});


const width_input = document.querySelector('#width');
const height_input = document.querySelector('#height');
const apply_button = document.querySelector('#apply');
const generate_preview = document.querySelector('#generate-preview');
const copy_button = document.querySelector('#copy');

const canvas = document.querySelector('.a-canvas');
const preview = document.querySelector('.preview');
const output = document.querySelector('.output');

let canvas_data = [];
let canvas_color_data = [];
let canvas_width = 10;
let canvas_height = 10;

function update_canvas() {
    canvas.innerHTML = '';

    for (let y = 0; y < canvas_height; y++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let x = 0; x < canvas_width; x++) {
            const input = document.createElement('input');
            input.classList.add('cell');
            input.classList.add('a-' + selected_color);
            input.value = canvas_data[y][x];
            row.appendChild(input);


            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    canvas_data[y][x] = ' ';
                    input.value = canvas_data[y][x];
                    canvas_color_data[y][x] = selected_color;
                    // clear all color classes
                    input.classList.remove(...input.classList);
                    input.classList.add('cell');

                    input.classList.add('a-' + selected_color);

                    // move cursor to the previous input field when  backspace is pressed
                    if (e.key === 'Backspace') {
                        if (x - 1 >= 0) {
                            row.children[x - 1].focus();
                        } else if (y - 1 >= 0) {
                            canvas.children[y - 1].children[canvas_width - 1].focus();
                        }
                    } else {
                        // move cursor to the next input field when delete is pressed
                        if (x + 1 < canvas_width) {
                            row.children[x + 1].focus();
                        } else if (y + 1 < canvas_height) {
                            canvas.children[y + 1].children[0].focus();
                        }
                    }
                } else {
                    if (e.key.length === 1) {
                        canvas_data[y][x] = e.key;
                        input.value = canvas_data[y][x];
                        canvas_color_data[y][x] = selected_color;
                        // clear all color classes
                        input.classList.remove(...input.classList);
                        input.classList.add('cell');

                        input.classList.add('a-' + selected_color);
                        // move cursor to the next input field
                        if (x + 1 < canvas_width) {
                            row.children[x + 1].focus();
                        } else if (y + 1 < canvas_height) {
                            canvas.children[y + 1].children[0].focus();
                        }
                    }
                }
            });

            input.addEventListener('input', (e) => {
                // cancel this event
                e.preventDefault();
            });
        }

        canvas.appendChild(row);
    }
}

function resize_canvas(width, height) {
    if (width < 1 || height < 1) {
        alert('Width and height must be greater than 0');
        return;
    }
    if (width > 300 || height > 300) {
        alert('Width and height must be less than 300');
        return;
    }
    canvas_width = parseInt(width);
    canvas_height = parseInt(height);
    let new_canvas_data = new Array(canvas_height).fill(null).map(() => new Array(canvas_width).fill(' '));
    let new_canvas_color_data = new Array(canvas_height).fill(null).map(() => new Array(canvas_width).fill('black'));

    for (let y = 0; y < Math.min(canvas_height, canvas_data.length); y++) {
        for (let x = 0; x < Math.min(canvas_width, canvas_data[y].length); x++) {
            new_canvas_data[y][x] = canvas_data[y][x];
            new_canvas_color_data[y][x] = canvas_color_data[y][x];
        }
    }
    canvas_data = new_canvas_data;
    canvas_color_data = new_canvas_color_data;
    update_canvas();
}

resize_canvas(10, 10);

apply_button.addEventListener('click', () => {
    resize_canvas(width_input.value, height_input.value);
});

function updatePreview () {
    preview.innerHTML = '';
    const container = document.createElement('pre');
    for (let y = 0; y < canvas_height; y++) {

        for (let x = 0; x < canvas_width; x++) {
            if (canvas_data[y][x] === ' ') {
                container.innerHTML += ' ';
                continue;
            }
            const cell = document.createElement('span');
            cell.classList.add('a-' + canvas_color_data[y][x]);
            cell.innerHTML = canvas_data[y][x];
            container.appendChild(cell);
        }
        container.innerHTML += '\n';
    }
    preview.appendChild(container);

    output.innerHTML = container.innerHTML;
}

generate_preview.addEventListener('click', updatePreview);

copy_button.addEventListener('click', () => {
    output.select();

    navigator.clipboard.writeText(output.value).then(() => {
        alert('Copied to clipboard');
    });
});