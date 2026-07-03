document.addEventListener('DOMContentLoaded', function() {
    const viewRange = document.getElementById('viewRange');
    const viewRangeValue = document.getElementById('viewRangeValue');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterCategory = document.getElementById('filterCategory');
    const filterTime = document.getElementById('filterTime');
    const applyFilter = document.getElementById('applyFilter');
    const resetFilter = document.getElementById('resetFilter');
    const contentItems = document.querySelectorAll('.content-item');
    const resultCount = document.getElementById('resultCount');

    if (viewRange && viewRangeValue) {
        viewRange.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val >= 1000) {
                viewRangeValue.textContent = (val / 1000).toFixed(1) + 'K+';
            } else {
                viewRangeValue.textContent = val + '+';
            }
        });
    }

    function filterContent() {
        const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = filterCategory ? filterCategory.value : '';
        let visibleCount = 0;

        contentItems.forEach(function(item) {
            const title = item.querySelector('.item-title') ? item.querySelector('.item-title').textContent.toLowerCase() : '';
            const desc = item.querySelector('.item-desc') ? item.querySelector('.item-desc').textContent.toLowerCase() : '';
            const itemCategory = item.querySelector('.item-category') ? item.querySelector('.item-category').textContent.toLowerCase() : '';
            
            let show = true;

            if (keyword) {
                if (!title.includes(keyword) && !desc.includes(keyword)) {
                    show = false;
                }
            }

            if (category) {
                let categoryMap = {
                    'security': 'bảo mật',
                    'ai': 'công nghệ ai',
                    'privacy': 'quyền riêng tư',
                    'analytics': 'phân tích dữ liệu',
                    'performance': 'hiệu suất'
                };
                let categoryText = categoryMap[category] || category;
                if (!itemCategory.includes(categoryText)) {
                    show = false;
                }
            }

            if (show) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (resultCount) {
            resultCount.textContent = visibleCount;
        }
    }

    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            filterContent();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterContent();
            }
        });
    }

    if (applyFilter) {
        applyFilter.addEventListener('click', function(e) {
            e.preventDefault();
            filterContent();
        });
    }

    if (resetFilter) {
        resetFilter.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput) searchInput.value = '';
            if (filterCategory) filterCategory.value = '';
            if (filterTime) filterTime.value = '';
            if (viewRange) viewRange.value = '1000';
            if (viewRangeValue) viewRangeValue.textContent = '1K+';
            contentItems.forEach(function(item) {
                item.style.display = 'flex';
            });
            if (resultCount) {
                resultCount.textContent = contentItems.length;
            }
        });
    }

    contentItems.forEach(function(item) {
        item.addEventListener('click', function() {
            window.location.href = 'holosec.html';
        });
    });
});