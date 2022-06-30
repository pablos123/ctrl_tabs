browser.commands.onCommand.addListener( (command) => {
    /* Get the tab index */
    const tab_index = command.match(/^([1-9]+)_tab$/);
    if (tab_index !== null) {
        /* The zero index of 'tab_index' always holds the full match */
        change_tab(tab_index[1] - 1);
    } else if ( command === "last_tab") {
        change_tab(-1);
    } else if ( command === "left_tab") {
        browser.tabs.query({active: true}).then( active_tabs => {
            const current_tab = active_tabs[0];
            change_tab(current_tab.index - 1);
        });
    } else if ( command === "right_tab") {
        browser.tabs.query({active: true}).then( active_tabs => {
            const current_tab = active_tabs[0];
            browser.tabs.query({}).then( all_tabs => {
                const tabs_count = all_tabs.length;
                if(tabs_count == current_tab.index + 1) {
                    change_tab(0);
                } else {
                    change_tab(current_tab.index + 1);
                }
            });
            change_tab(current_tab.index - 1);
        });
    } else if ( command === "close_tab") {
        browser.tabs.query({active: true}).then( active_tabs => {
            const current_tab = active_tabs[0];
            browser.tabs.remove(current_tab.id);
        });
    }
});

/* Get the tabs in the current window.
 * Set the 'tab_number' tab as active
 * */
function change_tab(tab_number) {
    console.log(tab_number);
    browser.tabs.query({active: true}).then( active_tabs => {
        const current_tab = active_tabs[0];
        if(current_tab.index === tab_number) {
            /* We are changing to the current tab, do nothing */
            return;
        }

        browser.tabs.query({currentWindow: true}).then( window_tabs => {
            browser.tabs.update(window_tabs.at(tab_number).id, { active: true });
            console.log(window_tabs);
        });
    });
}
