const API_URL = 'https://api.github.com/users/';
let repositoriesPerPage = 10;
let currentPage = 1;
let currentUsername = null;

function fetchUserDetails(username) {
    const userDetailsUrl = `${API_URL}${username}`;

    $.get(userDetailsUrl, function (user) {
        displayUserDetails(user);
        currentUsername = username;
        fetchRepositories();
    });
}

function fetchRepositories() {
    if (!currentUsername) {
        alert('Please enter a valid username.');
        return;
    }

    const repositoriesUrl = `${API_URL}${currentUsername}/repos?per_page=${repositoriesPerPage}&page=${currentPage}`;

    $('#repositories-list').empty();
    $('#loadingIndicator').show();

    $.get(repositoriesUrl, function (data, status, xhr) {
        const linkHeader = xhr.getResponseHeader('Link');
        const totalPages = extractTotalPages(linkHeader);

        displayRepositories(data);
        displayPagination(totalPages);
        $('#loadingIndicator').hide();
    });
}

function displayUserDetails(user) {
    const userPhoto = `<img src="${user.avatar_url}" alt="Profile Photo"  style="width: 150px; border-radius: 50%;margin-right:50px">`;
    const userDetails = `
    <div>
        <h2>${user.name || user.login}</h2>
        <p>GitHub: <a href="${user.html_url}" target="_blank">${user.login}</a></p>
        <p>Twitter: ${user.twitter_username ? `<a href="https://twitter.com/${user.twitter_username}" target="_blank">${user.twitter_username}</a>` : 'N/A'}</p>
        <p>Bio: ${user.bio || 'N/A'}</p>
        </div>
    `;

    $('#user-details').html(userPhoto + userDetails);

    const userDescription = `
        <p>${user.bio || 'No bio available.'}</p>
    `;

    $('#user-description').html(userDescription);
}

function displayRepositories(repositories) {
    repositories.forEach(repo => {
        const repoItem = $('<div class="repository-item"></div>');
        const repoDetails = `
            <h3>${repo.name}</h3>
            <p>Description: ${repo.description || 'N/A'}</p>
            <p>Language: ${repo.language || 'N/A'}</p>
            <p>URL: <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
        `;
        repoItem.html(repoDetails);
        $('#repositories-list').append(repoItem);
    });
}

function displayPagination(totalPages) {
    $('#pagination').empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = $(`<a href="#" onclick="changePage(${i})">${i}</a>`);
        $('#pagination').append(pageLink);
    }
}

function changePage(newPage) {
    currentPage = newPage;
    fetchRepositories();
}

function extractTotalPages(linkHeader) {
    if (!linkHeader) return 1;

    const links = linkHeader.split(',');
    const lastPageLink = links.find(link => link.includes('rel="last"'));
    if (!lastPageLink) return 1;

    const totalPagesMatch = lastPageLink.match(/&page=(\d+)>/);
    if (!totalPagesMatch) return 1;

    return parseInt(totalPagesMatch[1]);
}

$(document).ready(function () {
    const username = prompt('Enter Github username:');
    if (username) {
        fetchUserDetails(username);
    }
});
function displayPagination(totalPages) {
    $('#pagination').empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = $(`<a href="#" onclick="changePage(${i})">${i}</a>`);
        $('#pagination').append(pageLink);
    }
}
function displayPagination(totalPages) {
    $('#pagination').empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = $(`<a href="#" onclick="changePage(${i})">${i}</a>`);
        $('#pagination').append(pageLink);
    }
    $('#pagination a').css({
        margin: '0 5px',
        padding: '5px 10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        textDecoration: 'none',
        color: '#333',
        background: '#fff',
        cursor: 'pointer',
    });
}
