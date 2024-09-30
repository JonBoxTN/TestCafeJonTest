import { Selector } from 'testcafe';

//Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

fixture('Getting Started')
    .page('https://www.nytimes.com/games/wordle/index.html');

const playButtonDataAttribute = Selector("[data-testid='Play']")
const closeButtonAttribute = Selector("[aria-label='Close']")
const RowOneAttribute = Selector("[aria-label='Row 1']")

test('My first test', async t => {

    const playButton = await playButtonDataAttribute();    
    await t.click(playButton);

    const closeDialogButton = await closeButtonAttribute();    
    await t.click(closeDialogButton);

    //wait for puzzle grid to render
    const rowOneDiv = await RowOneAttribute();    

    //type  an invalid word
    await t
        .wait(250)
        .pressKey('A B C D E', { speed: 0.5 })
        .pressKey('enter')
        .wait(500);

    //connect to the first tile in the first row
    var firstTile = Selector("div[aria-label='Row 1']").child(0).child('div');    
    var firstTileAriaLabel = await firstTile.getAttribute('aria-label');

    //is this an unapproved 5 letters ?
    //determine how many strings (comma delimited) are in the aria-label attribute. Tiles in valid words have 3 strings
    var statStrings = await firstTileAriaLabel!.split(', ');
    
    await t
        .expect(statStrings.length).eql(2)
        .expect(firstTileAriaLabel).contains('1st letter, A');


    //remove non-approved word by pressing BACKSPACE 5 times
    await t
        .wait(250)
        .pressKey('backspace backspace backspace backspace backspace', { speed: 0.2 });

    //verify empty tile after backspaces to remove word from puzzle
    firstTileAriaLabel = await firstTile.getAttribute('aria-label');
    await t.expect(firstTileAriaLabel).eql('1st letter, empty');

    //type in a valid word
    await t
        .wait(250)
        .pressKey('Z E B R A', { speed: 0.5 })
        .pressKey('enter')
        .wait(1000);
    
    //check the first tile again
    firstTileAriaLabel = await firstTile.getAttribute('aria-label');
    var statStrings = await firstTileAriaLabel!.split(', ');
    await t
        .expect(statStrings.length).eql(3)
        .expect(statStrings[0]).eql('1st letter') //tile identification
        .expect(statStrings[1]).eql('Z') //the first letter typed
        .expect(statStrings[2]).match(/(correct|absent|present in another location)/) //instead of looking for tile background color
        .wait(3000); //we can admire our work for a few seconds

});